import { Menus } from "../menus/menus";

export interface Roles {
    id_r: number;
    nombre: string;
    estado: boolean;
    menus: Menus[];
}

export class Roles {
    constructor(
         id_r?: number,
         nombre?: string,
         estado?: boolean,
         menus?: Menus[]
    ) {}
}
