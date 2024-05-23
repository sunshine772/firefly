import { Municipios } from '../municipios/municipios';
import { Coordenadas } from '../coordenadas/coordenadas';

export interface Lineas {
  id_lin: number;
  nombre: string;
  estado: boolean;
  inicio: number;
  fin: number;

  coordenadas: Coordenadas;
}

export class Lineas {
  constructor(
    id_lin?: number,
    nombre?: string,
    estado?: boolean,
    inicio?: number,
    fin?: number,

    coordenadas?: Coordenadas
  ) {}
}
