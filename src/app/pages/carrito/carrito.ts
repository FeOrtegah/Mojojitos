import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { ClpPipe } from '../../pipes/clp.pipe';
import { NEGOCIO } from '../../config/negocio';

@Component({
  selector: 'app-carrito',
  imports: [RouterLink, ClpPipe],
  templateUrl: './carrito.html',
  styleUrl: './carrito.scss',
})
export class Carrito {
  protected readonly carrito = inject(CarritoService);
  protected readonly despacho = NEGOCIO.costoDespacho;
}