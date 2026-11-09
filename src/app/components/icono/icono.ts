import { Component, input } from '@angular/core';

export type NombreIcono =
  | 'copa'
  | 'carrito'
  | 'hoja'
  | 'check'
  | 'mensaje'
  | 'cerrar'
  | 'mas'
  | 'menos'
  | 'ubicacion'
  | 'gps'
  | 'buscar'
  | 'usuario'
  | 'telefono'
  | 'casa'
  | 'efectivo'
  | 'transferencia'
  | 'tarjeta'
  | 'nota'
  | 'despacho'
  | 'estrella'
  | 'flecha'
  | 'flecha'
  | 'reloj'
  | 'calendario';;

@Component({
  selector: 'app-icono',
  templateUrl: './icono.html',
  styles: `
    :host {
      display: inline-flex;
      line-height: 0;
    }
  `,
})
export class Icono {
  readonly nombre = input.required<NombreIcono>();
  readonly tamano = input(20);
}
