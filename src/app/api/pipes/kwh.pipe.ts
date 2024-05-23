import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kWh'
})
export class KwhPipe implements PipeTransform {
  transform(lectura: number): string {
    return `${lectura} kWh`;
  }
}
