import { Lugares } from "../lugares/lugares";
import { Rutas } from "../rutas/rutas";

export interface Calles {
  id_calle: number;
  nombre: string;
  estado: boolean;
  id_lug: number;
  id_rut: number;

  lugares: Lugares;
  rutas: Rutas;
}

export class Calles {
  constructor(
    id_calle?: number,
    nombre?: string,
    estado?: boolean,
    id_lug?: number,
    id_rut?: number
  ) {}
}
