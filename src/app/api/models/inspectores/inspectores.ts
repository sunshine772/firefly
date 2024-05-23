import { Empleados } from '../empleados/empleados';

export interface Inspectores {
  id_insp: number;
  estado: boolean;
  id_emp: number;

  empleados: Empleados
}

export class Inspectores extends Empleados {
  constructor(id_insp?: number, estado?: boolean, id_emp?: number) {
    super(id_emp);
  }
}
