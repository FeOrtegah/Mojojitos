import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { WhatsappService } from '../../services/whatsapp.service';
import { ClpPipe } from '../../pipes/clp.pipe';
import { NEGOCIO } from '../../config/negocio';
import { DatosEntrega } from '../../models/producto';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, ClpPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  protected readonly carrito = inject(CarritoService);
  private readonly whatsapp = inject(WhatsappService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly despacho = NEGOCIO.costoDespacho;
  protected readonly enviado = signal(false);
  protected readonly metodosPago = ['Efectivo', 'Transferencia', 'Tarjeta (débito/crédito)'];

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    telefono: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s]{8,15}$/)]],
    direccion: ['', Validators.required],
    comuna: ['', Validators.required],
    referencia: [''],
    metodoPago: ['Transferencia', Validators.required],
    comentarios: [''],
  });

  invalido(campo: keyof DatosEntrega): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  enviar(): void {
    if (this.form.invalid || this.carrito.items().length === 0) {
      this.form.markAllAsTouched();
      return;
    }
    this.whatsapp.enviarPedido(this.carrito.items(), this.form.getRawValue());
    this.enviado.set(true);
  }

  nuevoPedido(): void {
    this.carrito.vaciar();
    this.form.reset();
    this.router.navigate(['/']);
  }
}