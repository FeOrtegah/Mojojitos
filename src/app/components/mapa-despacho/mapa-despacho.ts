import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { Coordenadas } from '../../models/producto';
import { ORIGEN, PUNTOS_DESPACHO } from '../../config/cobertura';

const COLORES_PRECIO: Record<number, string> = {
  1500: '#b7e84b',
  2000: '#ffc93c',
  2500: '#ff8b45',
  3000: '#ff6b9a',
};

const PIN_CLIENTE = `
<svg width="40" height="48" viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 46s16-14.5 16-27A16 16 0 0 0 4 19c0 12.5 16 27 16 27z" fill="#ff6b9a" stroke="#171717" stroke-width="2"/>
  <circle cx="20" cy="19" r="6.5" fill="#171717"/>
</svg>`;

const PIN_LOCAL = `
<svg width="34" height="34" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
  <circle cx="17" cy="17" r="15" fill="#171717" stroke="#b7e84b" stroke-width="3"/>
  <path d="M11 11h12l-1.2 12a1.5 1.5 0 0 1-1.5 1.3h-6.6a1.5 1.5 0 0 1-1.5-1.3z" fill="none" stroke="#b7e84b" stroke-width="2" stroke-linejoin="round"/>
  <path d="M12 15h10" stroke="#b7e84b" stroke-width="2"/>
</svg>`;

@Component({
  selector: 'app-mapa-despacho',
  template: `<div #contenedor class="mapa"></div>`,
  styles: `
    :host {
      display: block;
    }

    .mapa {
      height: 320px;
      border-radius: 14px;
      border: 2px solid var(--gris-claro);
      overflow: hidden;
      z-index: 0;
    }
  `,
})
export class MapaDespacho implements OnDestroy {
  readonly centro = input.required<Coordenadas>();
  readonly ubicacion = input<Coordenadas | null>(null);
  readonly ubicacionCambiada = output<Coordenadas>();

  private readonly contenedor = viewChild.required<ElementRef<HTMLDivElement>>('contenedor');
  private mapa?: L.Map;
  private marcador?: L.Marker;

  constructor() {
    afterNextRender(() => this.iniciarMapa());

    effect(() => {
      const centro = this.centro();
      this.mapa?.flyTo([centro.lat, centro.lng], 15, { duration: 0.6 });
    });

    effect(() => {
      const ubicacion = this.ubicacion();
      if (!ubicacion || !this.mapa) return;
      // Si el cambio vino de un clic o arrastre en el mapa, el marcador ya está ahí
      const actual = this.marcador?.getLatLng();
      if (actual && actual.lat === ubicacion.lat && actual.lng === ubicacion.lng) return;
      this.ponerMarcador(ubicacion, true);
    });
  }

  private iniciarMapa(): void {
    const centro = this.centro();
    this.mapa = L.map(this.contenedor().nativeElement, { scrollWheelZoom: false }).setView(
      [centro.lat, centro.lng],
      13,
    );

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(this.mapa);

    // Zonas de cobertura
    for (const punto of PUNTOS_DESPACHO) {
      const color = COLORES_PRECIO[punto.precio] ?? '#a8a8a8';
      L.circle([punto.ubicacion.lat, punto.ubicacion.lng], {
        radius: punto.radio,
        color,
        weight: 1,
        fillColor: color,
        fillOpacity: 0.12,
        interactive: false,
      }).addTo(this.mapa);
    }

    // Punto de salida
    L.marker([ORIGEN.lat, ORIGEN.lng], {
      icon: L.divIcon({ html: PIN_LOCAL, className: '', iconSize: [34, 34], iconAnchor: [17, 17] }),
      interactive: false,
    }).addTo(this.mapa);

    this.mapa.on('click', (e: L.LeafletMouseEvent) => {
      const coordenadas = { lat: e.latlng.lat, lng: e.latlng.lng };
      this.ponerMarcador(coordenadas, false);
      this.ubicacionCambiada.emit(coordenadas);
    });

    const ubicacion = this.ubicacion();
    if (ubicacion) this.ponerMarcador(ubicacion, true);
  }

  private ponerMarcador(coordenadas: Coordenadas, centrar: boolean): void {
    if (!this.mapa) return;
    const posicion: L.LatLngExpression = [coordenadas.lat, coordenadas.lng];

    if (!this.marcador) {
      this.marcador = L.marker(posicion, {
        draggable: true,
        icon: L.divIcon({
          html: PIN_CLIENTE,
          className: '',
          iconSize: [40, 48],
          iconAnchor: [20, 46],
        }),
      }).addTo(this.mapa);

      this.marcador.on('dragend', () => {
        const { lat, lng } = this.marcador!.getLatLng();
        this.ubicacionCambiada.emit({ lat, lng });
      });
    } else {
      this.marcador.setLatLng(posicion);
    }

    if (centrar) this.mapa.flyTo(posicion, 16, { duration: 0.6 });
  }

  ngOnDestroy(): void {
    this.mapa?.remove();
  }
}
