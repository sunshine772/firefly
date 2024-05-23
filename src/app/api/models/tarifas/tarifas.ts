export interface Tarifas {
  id_tar: number;
  precio: number;
  tipo_tar: string;
  fecha: string;
  estado: boolean;
}

export class Tarifas {
  constructor(
     id_tar?: number,
     precio?: number,
     tipo_tar?: string,
     fecha?: string,
     estado?: boolean
  ) {}
}
