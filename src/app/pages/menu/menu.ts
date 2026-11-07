import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRODUCTOS } from '../../data/productos';
import { CarritoService } from '../../services/carrito.service';
import { ClpPipe } from '../../pipes/clp.pipe';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, ClpPipe],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  protected readonly carrito = inject(CarritoService);
  protected readonly productos = PRODUCTOS;

  cantidadEnCarrito(id: number): number {
    return this.carrito.items().find((i) => i.producto.id === id)?.cantidad ?? 0;
  }
}