import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { WhatsappService } from '../../services/whatsapp.service';
import { GeocodificacionService } from '../../services/geocodificacion.service';
import { ClpPipe } from '../../pipes/clp.pipe';
import { NEGOCIO } from '../../config/negocio';
import { COMUNAS, ORIGEN, buscarPuntoDespacho } from '../../config/cobertura';
import { Coordenadas, DatosEntrega, Despacho } from '../../models/producto';
import { Icono, NombreIcono } from '../../components/icono/icono';
import { MapaDespacho } from '../../components/mapa-despacho/mapa-despacho';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, ClpPipe, Icono, MapaDespacho],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  protected readonly carrito = inject(CarritoService);
  private readonly whatsapp = inject(WhatsappService);
  private readonly geocodificacion = inject(GeocodificacionService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly comunas = COMUNAS;
  protected readonly metodosPago = NEGOCIO.metodosPago;
  protected readonly iconosPago: Record<string, NombreIcono> = {
    Efectivo: 'efectivo',
    Transferencia: 'transferencia',
  };

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    telefono: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s]{8,15}$/)]],
    comuna: ['', Validators.required],
    direccion: ['', Validators.required],
    referencia: [''],
    metodoPago: [NEGOCIO.metodosPago[0], Validators.required],
    comentarios: [''],
  });

  // --- Ubicación y despacho ---
  protected readonly ubicacion = signal<Coordenadas | null>(null);
  protected readonly buscando = signal(false);
  protected readonly mensajeUbicacion = signal('');
  protected readonly intentoEnviar = signal(false);
  protected readonly enviado = signal(false);

  private readonly comunaElegida = toSignal(this.form.controls.comuna.valueChanges, {
    initialValue: '',
  });

  protected readonly centroMapa = computed(
    () => this.comunas.find((c) => c.nombre === this.comunaElegida())?.centro ?? ORIGEN,
  );

  protected readonly puntoDespacho = computed(() => {
    const ubicacion = this.ubicacion();
    return ubicacion ? buscarPuntoDespacho(ubicacion) : null;
  });

  protected readonly despacho = computed<Despacho | null>(() => {
    const punto = this.puntoDespacho();
    const ubicacion = this.ubicacion();
    return punto && ubicacion ? { zona: punto.zona, precio: punto.precio, ubicacion } : null;
  });

  protected readonly total = computed(
    () => this.carrito.subtotal() + (this.despacho()?.precio ?? 0),
  );

  invalido(campo: keyof DatosEntrega): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  alCambiarUbicacion(coordenadas: Coordenadas): void {
    this.ubicacion.set(coordenadas);
    this.mensajeUbicacion.set('');

    // Si el punto cae en otra comuna, la actualizamos
    const punto = buscarPuntoDespacho(coordenadas);
    if (punto && punto.comuna !== this.form.controls.comuna.value) {
      this.form.controls.comuna.setValue(punto.comuna, { emitEvent: false });
    }
  }

  async buscarDireccion(): Promise<void> {
    const { direccion, comuna } = this.form.getRawValue();
    if (!direccion || !comuna) {
      this.form.controls.direccion.markAsTouched();
      this.form.controls.comuna.markAsTouched();
      this.mensajeUbicacion.set('Elige tu comuna y escribe tu dirección para buscarla.');
      return;
    }

    this.buscando.set(true);
    const resultado = await this.geocodificacion.buscar(direccion, comuna);
    this.buscando.set(false);

    if (resultado) {
      this.alCambiarUbicacion(resultado);
    } else {
      this.mensajeUbicacion.set('No encontramos la dirección. Marca tu casa tocando el mapa.');
    }
  }

  usarMiUbicacion(): void {
    if (!navigator.geolocation) {
      this.mensajeUbicacion.set('Tu navegador no permite obtener la ubicación.');
      return;
    }
    this.buscando.set(true);
    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        this.buscando.set(false);
        this.alCambiarUbicacion({ lat: posicion.coords.latitude, lng: posicion.coords.longitude });
      },
      () => {
        this.buscando.set(false);
        this.mensajeUbicacion.set(
          'No pudimos obtener tu ubicación. Marca tu casa tocando el mapa.',
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  enviar(): void {
    this.intentoEnviar.set(true);
    if (this.form.invalid || !this.ubicacion() || this.carrito.items().length === 0) {
      this.form.markAllAsTouched();
      return;
    }
    this.whatsapp.enviarPedido(this.carrito.items(), this.form.getRawValue(), this.despacho());
    this.enviado.set(true);
  }

  nuevoPedido(): void {
    this.carrito.vaciar();
    this.router.navigate(['/']);
  }
}
