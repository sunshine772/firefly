import { Inspectores } from '../inspectores/inspectores';
import { Postes } from '../postes/postes';
import { Solicitudes } from '../solicitudes/solicitudes';

export interface Reclamos {
  id_rec: number;
  estado_rec: string;
  id_s: number;
  solicitudes: Solicitudes;
}

export class Reclamos extends Solicitudes {
  constructor(
    id_rec?: number,
    estado_rec?: string,
    id_s?: number,
    solicitudes?: Solicitudes
  ) {
    super(id_s);
  }
}
