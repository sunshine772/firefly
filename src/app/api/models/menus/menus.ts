import { Procesos } from "../procesos/procesos";

export interface Menus {
    id_m: number;
    nombre: string;
    icono: string;
    estado: boolean;
    procesos: Procesos[];
}

export class Menus {
    constructor(
         id_m?: number,
         nombre?: string,
         icono?: string,
         estado?: boolean,
         procesos?: Procesos[]
    ) {}
}
