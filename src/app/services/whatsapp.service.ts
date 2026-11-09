import { Injectable } from '@angular/core';
import { NEGOCIO } from '../config/negocio';
import { DatosEntrega, Despacho, ItemCarrito } from '../models/producto';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  private formatearPrecio(valor: number): string {
    return '$' + valor.toLocaleString('es-CL');
  }

  /** '2026-11-15' -> 'sábado 15/11' */
  private formatearFecha(fecha: string): string {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    const nombreDia = new Date(anio, mes - 1, dia).toLocaleDateString('es-CL', { weekday: 'long' });
    return `${nombreDia} ${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}`;
  }

  armarMensaje(items: ItemCarrito[], datos: DatosEntrega, despacho: Despacho | null): string {
    const subtotal = items.reduce((s, i) => s + i.producto.precio * i.cantidad, 0);
    const costoDespacho = despacho?.precio ?? 0;
    const programado = datos.tipoEntrega === 'programado';

    const lineas: string[] = [
      programado ? `*Pedido programado - ${NEGOCIO.nombre}*` : `*Nuevo pedido - ${NEGOCIO.nombre}*`,
      '',
    ];

    if (programado) {
      lineas.push(
        `*Entrega:* ${this.formatearFecha(datos.fecha)} a las ${datos.hora}`,
        '_(Por confirmar)_',
        '',
      );
    }

    lineas.push('*Productos:*');
    for (const item of items) {
      const sabores = item.sabores?.length ? ` (${item.sabores.join(' + ')})` : '';
      lineas.push(
        `- ${item.cantidad}x ${item.producto.nombre}${sabores} — ${this.formatearPrecio(item.producto.precio * item.cantidad)}`,
      );
    }

    lineas.push('', `Subtotal: ${this.formatearPrecio(subtotal)}`);
    lineas.push(
      despacho ? `Despacho: ${this.formatearPrecio(despacho.precio)}` : 'Despacho: a coordinar',
    );
    lineas.push(`*Total: ${this.formatearPrecio(subtotal + costoDespacho)}*`);

    lineas.push(
      '',
      '*Datos de entrega:*',
      `Nombre: ${datos.nombre}`,
      `Teléfono: ${datos.telefono}`,
      `Dirección: ${datos.direccion}, ${datos.comuna}`,
    );
    if (datos.referencia) lineas.push(`Referencia: ${datos.referencia}`);
    if (despacho) {
      const { lat, lng } = despacho.ubicacion;
      lineas.push(`Ubicación: https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`);
    }
    lineas.push(`Pago: ${datos.metodoPago}`);
    if (datos.comentarios) lineas.push(`Comentarios: ${datos.comentarios}`);

    return lineas.join('\n');
  }

  enviarPedido(items: ItemCarrito[], datos: DatosEntrega, despacho: Despacho | null): void {
    const mensaje = this.armarMensaje(items, datos, despacho);
    const url = `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }
}