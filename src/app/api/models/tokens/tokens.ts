export interface Tokens {
  id_token: number;
  token: string;
  fecha_creacion: string;
  fecha_expiracion: string;
  estado: boolean;
  id_usu: number;
}

export class Tokens {
  constructor(
    id_token?: number,
    token?: string,
    fecha_creacion?: string,
    fecha_expiracion?: string,
    estado?: boolean,
    id_usu?: number
  ) {}
}
