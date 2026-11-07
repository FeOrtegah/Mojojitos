import { Coordenadas } from '../models/producto';

/**
 * MAPA DE COBERTURA DE MOJOJITOS
 *
 * Para corregir una coordenada: en Google Maps haz clic derecho sobre el punto
 * exacto y presiona los números que aparecen arriba (se copian como "lat, lng").
 */

/** Punto de salida: Heraldo Latorre 970–989, Pudahuel (Teniente Cobo / Serrano) */
export const ORIGEN: Coordenadas = { lat: -33.4482, lng: -70.7488 };

export interface Comuna {
  nombre: string;
  centro: Coordenadas;
}

export const COMUNAS: Comuna[] = [
  { nombre: 'Pudahuel', centro: { lat: -33.4445, lng: -70.756 } },
  { nombre: 'Cerro Navia', centro: { lat: -33.42, lng: -70.74 } },
  { nombre: 'Lo Prado', centro: { lat: -33.446, lng: -70.723 } },
  { nombre: 'Maipú', centro: { lat: -33.483, lng: -70.752 } },
];

/**
 * Puntos de despacho. El cliente marca su ubicación y se cobra el precio
 * del punto más cercano, siempre que esté dentro de su radio (en metros).
 * Para cubrir un tramo completo de una calle se usan varios puntos seguidos.
 */
export interface PuntoDespacho {
  zona: string;
  comuna: string;
  ubicacion: Coordenadas;
  radio: number;
  precio: number;
}

export const PUNTOS_DESPACHO: PuntoDespacho[] = [
  // 1. ENEA – Pudahuel (Ruta 68, Vespucio, Costanera Norte, Lo Boza, Aeropuerto Sur)
  {
    zona: 'ENEA',
    comuna: 'Pudahuel',
    ubicacion: { lat: -33.432, lng: -70.783 },
    radio: 1800,
    precio: 1500,
  },
  {
    zona: 'ENEA',
    comuna: 'Pudahuel',
    ubicacion: { lat: -33.42, lng: -70.779 },
    radio: 1200,
    precio: 1500,
  },

  // Pudahuel cercano al punto de salida
  { zona: 'Pudahuel cercano', comuna: 'Pudahuel', ubicacion: ORIGEN, radio: 1800, precio: 1500 },

  // 2. Cerro Navia – Av. Costanera Sur, tramo completo Lanalhue → Huelén
  {
    zona: 'Cerro Navia (Costanera Sur)',
    comuna: 'Cerro Navia',
    ubicacion: { lat: -33.412, lng: -70.733 },
    radio: 700,
    precio: 2000,
  }, // Lanalhue
  {
    zona: 'Cerro Navia (Costanera Sur)',
    comuna: 'Cerro Navia',
    ubicacion: { lat: -33.4135, lng: -70.7395 },
    radio: 700,
    precio: 2000,
  },
  {
    zona: 'Cerro Navia (Costanera Sur)',
    comuna: 'Cerro Navia',
    ubicacion: { lat: -33.415, lng: -70.746 },
    radio: 700,
    precio: 2000,
  },
  {
    zona: 'Cerro Navia (Costanera Sur / Huelén)',
    comuna: 'Cerro Navia',
    ubicacion: { lat: -33.4165, lng: -70.7525 },
    radio: 700,
    precio: 2500,
  }, // Huelén

  // 3. Metro Pajaritos – Lo Prado (Gral. Óscar Bonilla, Santa Marta y alrededores)
  {
    zona: 'Metro Pajaritos',
    comuna: 'Lo Prado',
    ubicacion: { lat: -33.4574, lng: -70.716 },
    radio: 1200,
    precio: 2000,
  },

  // Maipú cercano (sector norte de Maipú)
  {
    zona: 'Maipú cercano',
    comuna: 'Maipú',
    ubicacion: { lat: -33.473, lng: -70.745 },
    radio: 1300,
    precio: 2500,
  },

  // 4. Mall Arauco Maipú (Av. Américo Vespucio y alrededores)
  {
    zona: 'Mall Arauco Maipú',
    comuna: 'Maipú',
    ubicacion: { lat: -33.483, lng: -70.752 },
    radio: 1200,
    precio: 3000,
  },
];

/** Distancia en metros entre dos coordenadas (fórmula de Haversine) */
export function distanciaMetros(a: Coordenadas, b: Coordenadas): number {
  const R = 6371000;
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Devuelve el punto de despacho que corresponde a una ubicación, o null si está fuera de cobertura */
export function buscarPuntoDespacho(ubicacion: Coordenadas): PuntoDespacho | null {
  let mejor: PuntoDespacho | null = null;
  let menorDistancia = Infinity;

  for (const punto of PUNTOS_DESPACHO) {
    const distancia = distanciaMetros(ubicacion, punto.ubicacion);
    if (distancia <= punto.radio && distancia < menorDistancia) {
      mejor = punto;
      menorDistancia = distancia;
    }
  }
  return mejor;
}
