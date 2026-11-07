export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  /** Ruta dentro de /public, ej: 'productos/mojojito-clasico.webp' */
  imagen: string;
  /** Color del líquido para la ilustración cuando no hay foto */
  color: string;
  tipo: 'sabor' | 'promo';
  /** Litros que incluye: 1 para sabores, 2 o 4 para promociones */
  litros: number;
  etiqueta?: string;
}

export interface ItemCarrito {
  /** Identifica la línea del carrito (producto + sabores elegidos) */
  clave: string;
  producto: Producto;
  cantidad: number;
  /** Solo para promociones: nombres de los sabores elegidos */
  sabores?: string[];
}

export interface Coordenadas {
  lat: number;
  lng: number;
}

export interface DatosEntrega {
  nombre: string;
  telefono: string;
  comuna: string;
  direccion: string;
  referencia: string;
  metodoPago: string;
  comentarios: string;
}

export interface Despacho {
  zona: string;
  precio: number;
  ubicacion: Coordenadas;
}
