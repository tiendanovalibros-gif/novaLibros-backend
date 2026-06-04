import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Maps a PreferenciaLiteraria name to Genero names it covers.
// Matching is case-insensitive substring; these expand the coverage
// beyond exact-name matches.
const PREF_GENERO_MAP: Record<string, string[]> = {
  'ciencia ficcion': ['ciencia ficcion', 'tecnologia', 'ciencia'],
  tecnologia: ['tecnologia', 'ciencia ficcion', 'ciencia'],
  novela: ['novela', 'ficcion'],
  ficcion: ['ficcion', 'novela', 'fantasy', 'ciencia ficcion'],
  fantasy: ['fantasy', 'ficcion', 'novela'],
  thriller: ['thriller', 'misterio'],
  misterio: ['misterio', 'thriller'],
  terror: ['terror'],
  romance: ['romance', 'novela'],
  historia: ['historia'],
  biografia: ['biografia'],
  autoayuda: ['autoayuda'],
  ciencia: ['ciencia', 'tecnologia'],
  filosofia: ['filosofia'],
  poesia: ['poesia'],
  infantil: ['infantil'],
  juvenil: ['juvenil'],
  'no ficcion': ['no ficcion', 'biografia', 'historia', 'autoayuda', 'ciencia'],
};

function prefToGeneros(prefNombre: string): string[] {
  const key = prefNombre.toLowerCase();
  return PREF_GENERO_MAP[key] ?? [key];
}

export interface SeccionRecomendacion {
  motivo: string;
  libros: any[];
}

export interface RecomendacionesResponse {
  secciones: SeccionRecomendacion[];
  coldStart: boolean;
  meta: {
    generosDetectados: string[];
    preferenciasCount: number;
  };
}

@Injectable()
export class RecomendacionesService {
  constructor(private readonly prisma: PrismaService) {}

  async getForUser(userId: string): Promise<RecomendacionesResponse> {
    const [preferencias, pedidos, reservas, busquedas, todosLibros] =
      await Promise.all([
        this.prisma.usuarioPreferencia.findMany({
          where: { idUsuario: userId },
          include: { preferenciaLiteraria: true },
        }),
        this.prisma.itemPedido.findMany({
          where: { pedido: { idUsuario: userId } },
          include: {
            libro: {
              include: { generos: { include: { genero: true } } },
            },
          },
        }),
        this.prisma.itemReserva.findMany({
          where: { reserva: { idUsuario: userId } },
          include: {
            libro: {
              include: { generos: { include: { genero: true } } },
            },
          },
        }),
        this.prisma.registroBusqueda.findMany({
          where: { idUsuario: userId },
          orderBy: { id: 'desc' },
          take: 10,
        }),
        this.prisma.libro.findMany({
          include: {
            autor: true,
            editorial: true,
            generos: { include: { genero: true } },
          },
          orderBy: { anoPublicacion: 'desc' },
        }),
      ]);

    // IDs of books already purchased/reserved — exclude from recommendations
    const compradosIds = new Set<string>([
      ...pedidos.map((i) => i.idLibro),
      ...reservas.map((i) => i.idLibro),
    ]);

    const librosDisponibles = todosLibros.filter(
      (l) => !compradosIds.has(l.id),
    );

    const coldStart =
      preferencias.length === 0 &&
      pedidos.length === 0 &&
      reservas.length === 0 &&
      busquedas.length === 0;

    if (coldStart) {
      return {
        coldStart: true,
        secciones: [
          {
            motivo: 'Libros destacados',
            libros: this.normalizeLibros(librosDisponibles.slice(0, 12)),
          },
        ],
        meta: { generosDetectados: [], preferenciasCount: 0 },
      };
    }

    // --- Build genre scoring map ---
    const generoScore = new Map<string, number>();

    // +3 per preference
    const prefNombres = preferencias.map((p) => p.preferenciaLiteraria.nombre);
    for (const pref of prefNombres) {
      for (const genNombre of prefToGeneros(pref)) {
        generoScore.set(
          genNombre.toLowerCase(),
          (generoScore.get(genNombre.toLowerCase()) ?? 0) + 3,
        );
      }
    }

    // +2 from purchased/reserved genres
    const historialLibros = [
      ...pedidos.map((i) => i.libro),
      ...reservas.map((i) => i.libro),
    ];
    for (const libro of historialLibros) {
      for (const rel of libro.generos) {
        const key = rel.genero.nombre.toLowerCase();
        generoScore.set(key, (generoScore.get(key) ?? 0) + 2);
      }
    }

    // --- Score each available book ---
    const scored = librosDisponibles.map((libro) => {
      let score = 0;
      let motivoKey = 'Basado en tus gustos';

      const libroGeneros = libro.generos.map((r: any) =>
        r.genero.nombre.toLowerCase(),
      );

      // Genre score
      for (const gNombre of libroGeneros) {
        score += generoScore.get(gNombre) ?? 0;
      }

      // +1 per search term match
      for (const b of busquedas) {
        const terms = b.criterio.toLowerCase().split(/\s+/);
        const haystack = `${libro.titulo} ${libro.descripcion ?? ''}`.toLowerCase();
        for (const term of terms) {
          if (term.length > 2 && haystack.includes(term)) {
            score += 1;
            motivoKey = 'Relacionado con tus búsquedas';
            break;
          }
        }
      }

      return { libro, score, motivoKey };
    });

    scored.sort((a, b) => b.score - a.score);

    const nonZero = scored.filter((s) => s.score > 0);
    const fallbackNeeded = nonZero.length < 6;

    const secciones: SeccionRecomendacion[] = [];

    if (preferencias.length > 0) {
      const paraTi = nonZero
        .filter((s) =>
          s.libro.generos.some((r: any) => {
            const key = r.genero.nombre.toLowerCase();
            return prefNombres.some((p) =>
              prefToGeneros(p).includes(key),
            );
          }),
        )
        .slice(0, 8);

      if (paraTi.length > 0) {
        secciones.push({
          motivo: `Basado en tus preferencias (${prefNombres.join(', ')})`,
          libros: this.normalizeLibros(paraTi.map((s) => s.libro)),
        });
      }
    }

    if (historialLibros.length > 0) {
      const historialGeneros = new Set(
        historialLibros.flatMap((l) =>
          l.generos.map((r: any) => r.genero.nombre.toLowerCase()),
        ),
      );
      const porHistorial = nonZero
        .filter(
          (s) =>
            !secciones[0]?.libros.some((l: any) => l.id === s.libro.id) &&
            s.libro.generos.some((r: any) =>
              historialGeneros.has(r.genero.nombre.toLowerCase()),
            ),
        )
        .slice(0, 6);

      if (porHistorial.length > 0) {
        secciones.push({
          motivo: 'Porque compraste o reservaste libros similares',
          libros: this.normalizeLibros(porHistorial.map((s) => s.libro)),
        });
      }
    }

    if (busquedas.length > 0) {
      const idsYaMostrados = new Set(
        secciones.flatMap((s) => s.libros.map((l: any) => l.id)),
      );
      const porBusqueda = scored
        .filter(
          (s) =>
            !idsYaMostrados.has(s.libro.id) &&
            s.motivoKey === 'Relacionado con tus búsquedas',
        )
        .slice(0, 6);

      if (porBusqueda.length > 0) {
        secciones.push({
          motivo: 'Relacionado con tus búsquedas recientes',
          libros: this.normalizeLibros(porBusqueda.map((s) => s.libro)),
        });
      }
    }

    if (fallbackNeeded || secciones.length === 0) {
      const idsYaMostrados = new Set(
        secciones.flatMap((s) => s.libros.map((l: any) => l.id)),
      );
      const destacados = librosDisponibles
        .filter((l) => !idsYaMostrados.has(l.id))
        .slice(0, 8);

      if (destacados.length > 0) {
        secciones.push({
          motivo: 'Libros destacados',
          libros: this.normalizeLibros(destacados),
        });
      }
    }

    const generosDetectados = Array.from(generoScore.keys());

    return {
      coldStart: false,
      secciones,
      meta: {
        generosDetectados,
        preferenciasCount: preferencias.length,
      },
    };
  }

  private normalizeLibros(libros: any[]) {
    return libros.map((libro) => {
      const idGeneros = Array.isArray(libro.generos)
        ? libro.generos.map((r: any) => r?.idGenero ?? r?.genero?.id).filter(Boolean)
        : [];
      return {
        ...libro,
        idGeneros,
        idGenero: idGeneros[0] ?? 0,
      };
    });
  }
}
