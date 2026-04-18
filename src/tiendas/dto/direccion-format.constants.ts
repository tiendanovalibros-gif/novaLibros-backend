export const DIRECCION_COLOMBIA_REGEX =
  /^(calle|cl|carrera|cra|kr|avenida|av|diagonal|diag|transversal|tv|via|vía)\s+[a-z0-9\s.-]+\s?#\s?[a-z0-9]+\s?-\s?[a-z0-9]+(?:\s+(apto|apartamento|local|oficina|torre|interior|bloque|casa)\s*[a-z0-9-]+)?$/i;

export const DIRECCION_COLOMBIA_MESSAGE =
  'La dirección debe tener formato colombiano, por ejemplo: "Calle 23 # 13-45" o "Carrera 8 # 19-47".';
