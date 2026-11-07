import { Injectable } from '@angular/core';
import { Coordenadas } from '../models/producto';

/**
 * Busca direcciones con Nominatim (OpenStreetMap), gratis y sin API key.
 * Solo se llama cuando el cliente presiona "Buscar", nunca mientras escribe.
 */
@Injectable({ providedIn: 'root' })
export class GeocodificacionService {
  // Rectángulo que cubre Pudahuel, Cerro Navia, Lo Prado y Maipú
  private readonly zona = '-70.83,-33.39,-70.69,-33.53';

  async buscar(direccion: string, comuna: string): Promise<Coordenadas | null> {
    const consulta = `${direccion}, ${comuna}, Región Metropolitana, Chile`;
    const url =
      'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=cl' +
      `&viewbox=${this.zona}&bounded=1&q=${encodeURIComponent(consulta)}`;

    try {
      const respuesta = await fetch(url, { headers: { 'Accept-Language': 'es' } });
      const resultados: { lat: string; lon: string }[] = await respuesta.json();
      if (!resultados.length) return null;
      return { lat: Number(resultados[0].lat), lng: Number(resultados[0].lon) };
    } catch {
      return null;
    }
  }
}
