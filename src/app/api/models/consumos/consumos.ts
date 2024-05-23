import { Lecturaciones } from '../lecturaciones/lecturaciones';
import { Tarifas } from '../tarifas/tarifas';

export interface Consumos {
  id_cons: number;
  consumo: number;
  fecha: string;
  observacion: string;
  total: number;
  id_lec: number;
  id_tar: number;
  
  lecturaciones: Lecturaciones;
  tarifas: Tarifas;
}

export class Consumos {
  constructor(
    id_cons?: number,
    consumo?: number,
    fecha?: string,
    observacion?: string,
    total?: number,
    id_lec?: number,
    id_tar?: number,
    lecturaciones?: Lecturaciones,
    tarifas?: Tarifas
  ) {}
}
