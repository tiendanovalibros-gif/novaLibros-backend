import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ValidateTiendaDireccionResponseDto } from './dto/validate-tienda-direccion-response.dto';

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state_district?: string;
  state?: string;
}

interface GeocodingCandidate {
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
  provider: 'nominatim' | 'arcgis';
}

interface ArcGisResponse {
  candidates?: ArcGisCandidate[];
}

interface ArcGisCandidate {
  address?: string;
  location?: {
    x?: number;
    y?: number;
  };
  attributes?: {
    Match_addr?: string;
    City?: string;
    Region?: string;
    Country?: string;
  };
}

@Injectable()
export class GeocodingService {
  private readonly baseUrl =
    process.env.GEOCODING_BASE_URL ?? 'https://nominatim.openstreetmap.org';
  private readonly defaultCountry =
    process.env.GEOCODING_DEFAULT_COUNTRY ?? 'Colombia';
  private readonly defaultCountryCode =
    process.env.GEOCODING_DEFAULT_COUNTRY_CODE ?? 'co';
  private readonly timeoutMs = Number(process.env.GEOCODING_TIMEOUT_MS ?? 7000);
  private readonly enableArcGisFallback =
    (process.env.GEOCODING_ARCGIS_FALLBACK ?? 'true').toLowerCase() === 'true';
  private readonly userAgent =
    process.env.GEOCODING_USER_AGENT ??
    'NovaLibrosBackend/1.0 (support@novalibros.local)';

  async validateAddressInCity(
    direccion: string,
    ciudad: string,
  ): Promise<ValidateTiendaDireccionResponseDto> {
    const normalizedDireccion = direccion.trim();
    const normalizedCiudad = ciudad.trim();

    let candidates: GeocodingCandidate[] = [];

    try {
      candidates = await this.searchCandidates(
        normalizedDireccion,
        normalizedCiudad,
      );
    } catch (error) {
      if (!this.enableArcGisFallback) {
        throw error;
      }
    }

    if (candidates.length === 0 && this.enableArcGisFallback) {
      candidates = await this.searchWithArcGis(
        normalizedDireccion,
        normalizedCiudad,
      );
    }

    if (candidates.length === 0) {
      throw new BadRequestException(
        'No se encontró la dirección para la ciudad indicada. Usa una dirección real con nomenclatura (ej: Calle 100 # 7-45).',
      );
    }

    const candidate = this.pickCandidateByCity(candidates, normalizedCiudad);

    if (!candidate) {
      throw new BadRequestException(
        `La dirección no pertenece a la ciudad seleccionada (${normalizedCiudad})`,
      );
    }

    const latitud = Number(candidate.lat);
    const longitud = Number(candidate.lon);

    if (Number.isNaN(latitud) || Number.isNaN(longitud)) {
      throw new ServiceUnavailableException(
        'No fue posible obtener coordenadas válidas para la dirección',
      );
    }

    return {
      coincideCiudad: true,
      latitud,
      longitud,
      ciudadDetectada: this.extractCity(candidate.address),
      direccionNormalizada: candidate.display_name,
      proveedor: candidate.provider,
    };
  }

  private async searchCandidates(
    direccion: string,
    ciudad: string,
  ): Promise<GeocodingCandidate[]> {
    const searchUrls = [
      this.buildStructuredSearchUrl(direccion, ciudad),
      this.buildFreeTextSearchUrl(direccion, ciudad),
      this.buildFreeTextSearchUrl(direccion, ''),
    ];

    const uniqueCandidates = new Map<string, GeocodingCandidate>();

    for (const url of searchUrls) {
      const candidates = await this.fetchCandidates(url);

      for (const candidate of candidates) {
        const key = `${candidate.lat}|${candidate.lon}|${candidate.display_name}`;
        uniqueCandidates.set(key, {
          ...candidate,
          provider: 'nominatim',
        });
      }

      if (uniqueCandidates.size > 0) {
        break;
      }
    }

    return Array.from(uniqueCandidates.values());
  }

  private async searchWithArcGis(
    direccion: string,
    ciudad: string,
  ): Promise<GeocodingCandidate[]> {
    const url = new URL(
      'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates',
    );

    url.searchParams.set('f', 'pjson');
    url.searchParams.set(
      'singleLine',
      `${direccion}, ${ciudad}, ${this.defaultCountry}`,
    );
    url.searchParams.set('outFields', 'Match_addr,City,Region,Country');
    url.searchParams.set('maxLocations', '5');

    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), this.timeoutMs);

    try {
      const response = await fetch(url.toString(), {
        signal: abortController.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        return [];
      }

      const body = (await response.json()) as ArcGisResponse;
      const candidates = Array.isArray(body?.candidates) ? body.candidates : [];

      return candidates
        .filter(
          (candidate) =>
            typeof candidate?.location?.x === 'number' &&
            typeof candidate?.location?.y === 'number',
        )
        .map((candidate) => ({
          lat: String(candidate.location!.y),
          lon: String(candidate.location!.x),
          display_name:
            candidate.attributes?.Match_addr ??
            candidate.address ??
            `${direccion}, ${ciudad}, ${this.defaultCountry}`,
          address: {
            city: candidate.attributes?.City,
            state: candidate.attributes?.Region,
          },
          provider: 'arcgis' as const,
        }));
    } catch {
      return [];
    } finally {
      clearTimeout(timeout);
    }
  }

  private buildStructuredSearchUrl(direccion: string, ciudad: string): string {
    const url = new URL('/search', this.baseUrl);

    url.searchParams.set('street', direccion);
    url.searchParams.set('city', ciudad);
    url.searchParams.set('country', this.defaultCountry);
    url.searchParams.set('countrycodes', this.defaultCountryCode);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('limit', '5');
    url.searchParams.set('accept-language', 'es');

    return url.toString();
  }

  private buildFreeTextSearchUrl(direccion: string, ciudad?: string): string {
    const url = new URL('/search', this.baseUrl);

    const query = [direccion, ciudad, this.defaultCountry]
      .filter((part) => part && part.trim().length > 0)
      .join(', ');

    url.searchParams.set('q', query);
    url.searchParams.set('countrycodes', this.defaultCountryCode);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('limit', '5');
    url.searchParams.set('accept-language', 'es');

    return url.toString();
  }

  private async fetchCandidates(
    url: string,
  ): Promise<Omit<GeocodingCandidate, 'provider'>[]> {
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        signal: abortController.signal,
        headers: {
          'User-Agent': this.userAgent,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new ServiceUnavailableException(
          'El servicio de geocodificación no está disponible en este momento',
        );
      }

      const body = (await response.json()) as Omit<
        GeocodingCandidate,
        'provider'
      >[];
      return Array.isArray(body) ? body : [];
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new ServiceUnavailableException(
        'No se pudo consultar el servicio de geocodificación',
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  private pickCandidateByCity(
    candidates: GeocodingCandidate[],
    ciudadEsperada: string,
  ): GeocodingCandidate | undefined {
    const normalizedExpected = this.normalizeText(ciudadEsperada);

    return candidates.find((candidate) => {
      const detected = this.extractCity(candidate.address);
      const normalizedDetected = this.normalizeText(detected);
      const normalizedDisplayName = this.normalizeText(candidate.display_name);

      return (
        normalizedDetected === normalizedExpected ||
        normalizedDetected.includes(normalizedExpected) ||
        normalizedExpected.includes(normalizedDetected) ||
        normalizedDisplayName.includes(normalizedExpected)
      );
    });
  }

  private extractCity(address?: NominatimAddress): string {
    if (!address) {
      return '';
    }

    return (
      address.city ??
      address.town ??
      address.village ??
      address.municipality ??
      address.county ??
      address.state_district ??
      address.state ??
      ''
    );
  }

  private normalizeText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }
}
