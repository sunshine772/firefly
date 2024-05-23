import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'solicitado'
})
export class SolicitadoPipe implements PipeTransform {
  transform(fecha: string, hora: string): string {
    const now = new Date();
    const published = new Date(`${fecha} ${hora}`);
    const diff = now.getTime() - published.getTime();

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < minute) {
      return `Solicitado hace ${Math.floor(diff / 1000)} segundos`;
    } else if (diff < hour) {
      return `Solicitado hace ${Math.floor(diff / minute)} minutos`;
    } else if (diff < day) {
      return `Solicitado hace ${Math.floor(diff / hour)} horas`;
    } else {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return `Solicitado el ${published.toLocaleDateString(undefined, options)}`;
    }
  }
}
