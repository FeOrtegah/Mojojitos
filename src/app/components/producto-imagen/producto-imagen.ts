import { Component, input, signal } from '@angular/core';
import { Producto } from '../../models/producto';
import { MojitoIlustracion } from '../mojito-ilustracion/mojito-ilustracion';

/** Muestra la foto del producto; si no existe todavía, muestra la ilustración */
@Component({
  selector: 'app-producto-imagen',
  imports: [MojitoIlustracion],
  template: `
    @if (!fallo()) {
      <img
        [src]="producto().imagen"
        [alt]="producto().nombre"
        loading="lazy"
        (error)="fallo.set(true)"
      />
    } @else {
      <app-mojito-ilustracion [color]="producto().color" [vasos]="producto().litros" />
    }
  `,
  styles: `
    :host {
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    app-mojito-ilustracion {
      height: 80%;
    }
  `,
})
export class ProductoImagen {
  readonly producto = input.required<Producto>();
  protected readonly fallo = signal(false);
}
