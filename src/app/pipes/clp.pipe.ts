import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'clp' })
export class ClpPipe implements PipeTransform {
  transform(valor: number): string {
    return '$' + valor.toLocaleString('es-CL');
  }
}