import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { ClpPipe } from '../../pipes/clp.pipe';
import { Icono } from '../../components/icono/icono';
import { ProductoImagen } from '../../components/producto-imagen/producto-imagen';

@Component({
  selector: 'app-carrito',
  imports: [RouterLink, ClpPipe, Icono, ProductoImagen],
  templateUrl: './carrito.html',
  styleUrl: './carrito.scss',
})
export class Carrito {
  protected readonly carrito = inject(CarritoService);
}
