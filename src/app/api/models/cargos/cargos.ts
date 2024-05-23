import { Areas } from "../areas/areas";

export interface Cargos {
    id_car: number;
    nombre: string;
    descripcion: string;
    estado: boolean;
    id_a: number;
    
    areas: Areas;
}

export class Cargos {
    constructor(
         id_car?: number,
         nombre?: string,
         descripcion?: string,
         estado?: boolean,
         id_a?: number,
         areas?: Areas
    ) {}
}
