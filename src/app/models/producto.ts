export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export interface DatosEntrega {
  nombre: string;
  telefono: string;
  direccion: string;
  comuna: string;
  referencia: string;
  metodoPago: string;
  comentarios: string;
}