import { Empleados } from "../empleados/empleados";
import { Lugares } from "../lugares/lugares";

export interface Operaciones {
    id_op: number;
    objetivo: string;
    descripcion: string;
    desde: string;
    hasta: string;
    fecha: string;
    estado: boolean;
    id_lug: number;
    id_emp: number;

    lugares: Lugares;
    empleados: Empleados;
}

export class Operaciones {
    constructor(
         id_op?: number,
         objetivo?: string,
         descripcion?: string,
         desde?: string,
         hasta?: string,
         fecha?: string,
         estado?: boolean,
         id_lug?: number,
         id_emp?: number
    ) {}
}
