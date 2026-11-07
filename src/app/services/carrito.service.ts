import { Injectable, computed, effect, signal } from '@angular/core';
import { ItemCarrito, Producto } from '../models/producto';

const CLAVE_STORAGE = 'mojojitos-carrito-v2';

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
    effect(() => localStorage.setItem(CLAVE_STORAGE, JSON.stringify(this.items())));
  }

  /** Para promociones se pasan los sabores elegidos */
  agregar(producto: Producto, sabores?: string[]): void {
    const ordenados = sabores ? [...sabores].sort() : undefined;
    const clave = ordenados ? `${producto.id}:${ordenados.join('+')}` : producto.id;

    if (this.items().some((i) => i.clave === clave)) {
      this.cambiarCantidad(clave, 1);
    } else {
      this.items.update((items) => [
        ...items,
        { clave, producto, cantidad: 1, sabores: ordenados },
      ]);
    }
  }

  cambiarCantidad(clave: string, delta: number): void {
    this.items.update((items) =>
      items
        .map((i) => (i.clave === clave ? { ...i, cantidad: i.cantidad + delta } : i))
        .filter((i) => i.cantidad > 0),
    );
  }

  quitar(clave: string): void {
    this.items.update((items) => items.filter((i) => i.clave !== clave));
  }

  vaciar(): void {
    this.items.set([]);
  }

  cantidadDe(clave: string): number {
    return this.items().find((i) => i.clave === clave)?.cantidad ?? 0;
  }

  private cargar(): ItemCarrito[] {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_STORAGE) ?? '[]');
    } catch {
      return [];
    }
  }
}
