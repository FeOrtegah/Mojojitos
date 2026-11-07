import { Injectable } from '@angular/core';
import { NEGOCIO } from '../config/negocio';
import { DatosEntrega, ItemCarrito } from '../models/producto';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  formatearPrecio(valor: number): string {
    return '$' + valor.toLocaleString('es-CL');
  }

  armarMensaje(items: ItemCarrito[], datos: DatosEntrega): string {
    const subtotal = items.reduce((s, i) => s + i.producto.precio * i.cantidad, 0);
    const total = subtotal + NEGOCIO.costoDespacho;

    const lineas = [
      `🍹 *Nuevo pedido - ${NEGOCIO.nombre}*`,
      '',
      '*Productos:*',
      ...items.map(
        (i) =>
          `• ${i.cantidad}x ${i.producto.nombre} — ${this.formatearPrecio(i.producto.precio * i.cantidad)}`,
      ),
      '',
      `Subtotal: ${this.formatearPrecio(subtotal)}`,
    ];

    if (NEGOCIO.costoDespacho > 0) {
      lineas.push(`Despacho: ${this.formatearPrecio(NEGOCIO.costoDespacho)}`);
    }

    lineas.push(
      `*Total: ${this.formatearPrecio(total)}*`,
      '',
      '*Entrega:*',
      `👤 ${datos.nombre}`,
      `📞 ${datos.telefono}`,
      `📍 ${datos.direccion}, ${datos.comuna}`,
    );

    if (datos.referencia) lineas.push(`🏠 Ref: ${datos.referencia}`);
    lineas.push(`💳 Pago: ${datos.metodoPago}`);
    if (datos.comentarios) lineas.push(`📝 ${datos.comentarios}`);

    return lineas.join('\n');
  }

  enviarPedido(items: ItemCarrito[], datos: DatosEntrega): void {
    const mensaje = this.armarMensaje(items, datos);
    const url = `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }
}