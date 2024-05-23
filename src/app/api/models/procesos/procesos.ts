export interface Procesos {
    id_pr: number;
    nombre: string;
    icono: string;
    enlace: string;
    ayuda: string;
    estado: boolean;
}

export class Procesos {
    constructor(
         id_pr?: number,
         nombre?: string,
         icono?: string,
         enlace?: string,
         ayuda?: string,
         estado?: boolean
    ) {}
}
