import { Injectable, computed, effect, signal } from '@angular/core';
import { ItemCarrito, Producto } from '../models/producto';

const CLAVE = 'mojojitos-carrito';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  readonly items = signal<ItemCarrito[]>(this.cargar());

  readonly cantidadTotal = computed(() =>
    this.items().reduce((suma, item) => suma + item.cantidad, 0),
  );

  readonly subtotal = computed(() =>
    this.items().reduce((suma, item) => suma + item.producto.precio * item.cantidad, 0),
  );

  constructor() {
    effect(() => localStorage.setItem(CLAVE, JSON.stringify(this.items())));
  }

  agregar(producto: Producto): void {
    const existe = this.items().some((i) => i.producto.id === producto.id);
    if (existe) {
      this.cambiarCantidad(producto.id, 1);
    } else {
      this.items.update((items) => [...items, { producto, cantidad: 1 }]);
    }
  }

  cambiarCantidad(id: number, delta: number): void {
    this.items.update((items) =>
      items
        .map((i) => (i.producto.id === id ? { ...i, cantidad: i.cantidad + delta } : i))
        .filter((i) => i.cantidad > 0),
    );
  }

  quitar(id: number): void {
    this.items.update((items) => items.filter((i) => i.producto.id !== id));
  }

  vaciar(): void {
    this.items.set([]);
  }

  private cargar(): ItemCarrito[] {
    try {
      return JSON.parse(localStorage.getItem(CLAVE) ?? '[]');
    } catch {
      return [];
    }
  }
}
