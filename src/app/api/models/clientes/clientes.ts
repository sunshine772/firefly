import { Personas } from '../personas/personas';

export interface Clientes {
  id_cli: number;
  tercera_edad: boolean;
  id_p: number;
  personas: Personas;
}

export class Clientes extends Personas {
  constructor(id_cli?: number, id_p?: number) {
    super(id_p);
  }
}
