import { Component, computed, input, output, signal } from '@angular/core';
import { Producto } from '../../models/producto';
import { SABORES } from '../../data/productos';
import { ClpPipe } from '../../pipes/clp.pipe';
import { Icono } from '../icono/icono';
import { MojitoIlustracion } from '../mojito-ilustracion/mojito-ilustracion';

@Component({
  selector: 'app-selector-sabores',
  imports: [ClpPipe, Icono, MojitoIlustracion],
  templateUrl: './selector-sabores.html',
  styleUrl: './selector-sabores.scss',
})
export class SelectorSabores {
  readonly promo = input.required<Producto>();
  readonly cerrar = output<void>();
  readonly confirmar = output<string[]>();

  protected readonly sabores = SABORES;
  protected readonly cantidades = signal<Record<string, number>>({});

  protected readonly elegidos = computed(() =>
    Object.values(this.cantidades()).reduce((suma, n) => suma + n, 0),
  );
  protected readonly completo = computed(() => this.elegidos() === this.promo().litros);

  cantidad(id: string): number {
    return this.cantidades()[id] ?? 0;
  }

  cambiar(id: string, delta: number): void {
    const nueva = this.cantidad(id) + delta;
    if (nueva < 0 || (delta > 0 && this.completo())) return;
    this.cantidades.update((c) => ({ ...c, [id]: nueva }));
  }

  agregar(): void {
    if (!this.completo()) return;
    // Ej: ['2 Clásico', '1 Pink']
    const lista = this.sabores
      .filter((sabor) => this.cantidad(sabor.id) > 0)
      .map((sabor) => `${this.cantidad(sabor.id)} ${sabor.nombre.replace('Mojojito ', '')}`);
    this.confirmar.emit(lista);
  }
}
