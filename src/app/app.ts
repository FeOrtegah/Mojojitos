import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CarritoService } from './services/carrito.service';
import { NEGOCIO } from './config/negocio';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly carrito = inject(CarritoService);
  protected readonly nombre = NEGOCIO.nombre;
  protected readonly anio = new Date().getFullYear();
}