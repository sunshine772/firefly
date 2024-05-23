import { Medidores } from '../medidores/medidores';
import { Rutas } from '../rutas/rutas';
import { Empleados } from '../empleados/empleados';

export interface Lecturaciones {
  id_lec: number;
  fecha: String;
  observacion: string;
  lectura_anterior: number;
  lectura_actual: number;
  irregularidad: string;
  id_rut: number;
  id_med: number;
  id_emp: number;

  rutas: Rutas;
  medidores: Medidores;
  empleados: Empleados;
}

export class Lecturaciones {
  constructor(
    id_lec?: number,
    fecha?: Date,
    observacion?: string,
    lectura_anterior?: number,
    lectura_actual?: number,
    irregularidad?: string,
    id_rut?: number,
    id_med?: number,
    id_emp?: number,
    rutas?: Rutas,
    medidores?: Medidores,
    empleados?: Empleados
  ) {}
}
