import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'aprobada',
})
export class AprobadaPipe implements PipeTransform {
  transform(fecha: string, desde: string, hasta: string): string {
    const formattedDate = new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedDesde = this.formatTime(desde);
    const formattedHasta = this.formatTime(hasta);

    return `Operación aprobada para el ${formattedDate} desde las ${formattedDesde} hasta las ${formattedHasta}`;
  }

  private formatTime(time: string): string {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'pm' : 'am';

    const formattedHour = hour % 12 || 12;
    const formattedMinute = minute.toString().padStart(2, '0');

    return `${formattedHour}:${formattedMinute} ${period}`;
  }
}
