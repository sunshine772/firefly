import { Clientes } from '../clientes/clientes';
import { Empleados } from '../empleados/empleados';
import { Ampliaciones } from '../ampliaciones/ampliaciones';
import { Instalaciones } from '../instalaciones/instalaciones';
import { Reclamos } from '../reclamos/reclamos';
import { Inspectores } from '../inspectores/inspectores';
import { Coordenadas } from '../coordenadas/coordenadas';

export interface Solicitudes {
  id_s: number;
  fecha: string;
  hora: string;
  tipo_s: string;
  estado_s: string;
  id_coor: number;
  id_cli: number;
  id_emp: number;

  coordenadas: Coordenadas;
  clientes: Clientes;
  inspectores: Inspectores;
}

export class Solicitudes {
  constructor(
    id_s?: number,
    fecha?: string,
    hora?: string,
    tipo_s?: string,
    estado_s?: string,
    id_coor?: number,
    id_cli?: number,
    id_emp?: number,

    coordenadas?: Coordenadas,
    clientes?: Clientes,
    empleados?: Empleados
  ) {}
}
