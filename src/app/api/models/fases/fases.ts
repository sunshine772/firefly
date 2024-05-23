export interface Fases {
  id_fa: number;
  nombre: string;
  estado: boolean;
}

export class Fases {
  constructor(
       id_fa?: number,
       nombre?: string,
       estado?: boolean
  ) {}
}
