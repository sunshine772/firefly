import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthYear'
})
export class MonthYearPipe implements PipeTransform {
  transform(value: string): string {
    const dateParts = value.split('-');
    const year = dateParts[0];
    const month = +dateParts[1];

    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return `${monthNames[month - 1]} de ${year}`;
  }
}
