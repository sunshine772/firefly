import { Empleados } from "../empleados/empleados";
import { Subordinados } from "../subordinados/subordinados";

export interface Responsables {
    id_res: number;
    inicio: string;
    fin: string;
    estado: boolean;
    ci: number;
    
    empleados: Empleados;
    subordinados: Subordinados;
}

export class Responsables {
    constructor(
         id_res?: number,
         inicio?: string,
         fin?: string,
         estado?: boolean,
         ci?: number,
         empleados?: Empleados
    ) {}
}
