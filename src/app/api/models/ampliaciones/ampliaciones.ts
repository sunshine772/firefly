import { Solicitudes } from '../solicitudes/solicitudes';

export interface Ampliaciones {
  id_amp: number;
  estado_amp: string;
  id_s: number;
  solicitudes: Solicitudes;
}

export class Ampliaciones extends Solicitudes {
  constructor(id_amp?: number, estado_amp?: string, id_s?: number) {
    super(id_s);
  }
}
