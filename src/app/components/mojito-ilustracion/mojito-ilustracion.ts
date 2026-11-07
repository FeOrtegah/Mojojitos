import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-mojito-ilustracion',
  templateUrl: './mojito-ilustracion.html',
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    svg {
      height: 100%;
      width: auto;
      display: block;
      margin: 0 auto;
    }
  `,
})
export class MojitoIlustracion {
  /** Color del líquido */
  readonly color = input('#b7e84b');
  /** 1 = un mojito, 2 o más = promoción (se dibujan vasos detrás) */
  readonly vasos = input(1);

  protected readonly posiciones = computed(() => {
    const principal = { transform: 'translate(20 0)', opacidad: 1 };
    if (this.vasos() <= 1) return [principal];
    return [
      { transform: 'translate(-22 10) scale(0.9)', opacidad: 0.5 },
      { transform: 'translate(58 10) scale(0.9)', opacidad: 0.5 },
      principal,
    ];
  });
}
