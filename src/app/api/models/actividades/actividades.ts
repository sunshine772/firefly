import { Empleados } from '../empleados/empleados';
import { Operaciones } from '../operaciones/operaciones';

export interface Actividades {
  id_act: number;
  labor: string;
  hprog: string;
  estado:boolean;
  id_emp: number;
  id_op: number;
  empleados: Empleados;
  operaciones: Operaciones;
}

export class Actividades implements Actividades {
  constructor(
    id_act?: number,
    labor?: string,
    hprog?: string,
    estado?: boolean,
    id_emp?: number,
    id_op?: number,
    empleados?: Empleados,
    operaciones?: Operaciones
  ) {}
}
