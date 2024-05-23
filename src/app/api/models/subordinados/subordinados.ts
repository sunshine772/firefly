import { Empleados } from "../empleados/empleados";
import { Responsables } from "../responsables/responsables";

export interface Subordinados {
    ci: number;
    id_res: number;
    empleados: Empleados;
    responsables: Responsables;
}

export class Subordinados {
    constructor(
         ci?: number,
         id_res?: number,
         empleados?: Empleados,
         responsables?: Responsables
    ) {}
}
