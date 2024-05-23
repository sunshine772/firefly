export interface Areas {
  id_a: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export class Areas {
  constructor(
    id_a?: number,
    nombre?: string,
    descripcion?: string,
    estado?: boolean
  ) {}
}
