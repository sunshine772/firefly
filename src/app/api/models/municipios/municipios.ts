export interface Municipios {
    id_mu: number;
    nombre: string;
    estado: boolean;
}

export class Municipios {
    constructor(
         id_mu?: number,
         nombre?: string,
         estado?: boolean
    ) {}
}
