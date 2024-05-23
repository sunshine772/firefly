import { Coordenadas } from '../coordenadas/coordenadas';
import { Inspectores } from '../inspectores/inspectores';
import { Solicitudes } from '../solicitudes/solicitudes';

export interface Instalaciones {
  id_ins: number;
  estado_ins: string;
  id_s: number;

  solicitudes: Solicitudes;
}

export class Instalaciones extends Solicitudes {
  constructor(
    id_ins?: number,
    estado_ins?: string,
    id_s?: number,
    solicitudes?: Solicitudes
  ) {
    super(id_s);
  }
}
