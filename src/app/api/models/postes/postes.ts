import { Coordenadas } from "../coordenadas/coordenadas";

export interface Postes {
    id_pos: number;
    tipo_pos: string;
    estado: boolean;
    id_coor: number;
    coordenadas: Coordenadas;
}

export class Postes {
    constructor(
         id_pos?: number,
         tipo_pos?: string,
         estado?: boolean,
         id_coor?: number,
         coordenadas?: Coordenadas
    ) {}
}
