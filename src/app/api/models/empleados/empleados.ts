import { Cargos } from '../cargos/cargos';
import { Personas } from '../personas/personas';
import { Usuarios } from '../usuarios/usuarios';

export interface Empleados {
  id_emp: number;
  email: string;
  id_car: number;
  id_p: number;

  cargos: Cargos;
  personas: Personas;
}

export class Empleados extends Personas {
  constructor(id_emp?: number, email?: string, id_car?: number, id_p?: number) {
    super(id_p);
  }
}
