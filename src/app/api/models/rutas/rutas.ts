import { Medidores } from '../medidores/medidores';

export interface Rutas {
  id_rut: number;
  nombre: string;
  estado: boolean;
  id_lug: number;

  medidores: Medidores[];
}

export class Rutas {
  constructor(
    id_rut?: number,
    nombre?: string,
    estado?: boolean,
    id_lug?: number,
    medidores?: Medidores[]
  ) {}
}
