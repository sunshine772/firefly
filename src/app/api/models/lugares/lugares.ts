import { Municipios } from "../municipios/municipios";
import { Coordenadas } from "../coordenadas/coordenadas";

export interface Lugares {
    id_lug: number;
    nombre: string;
    estado: boolean;
    id_mu: number;
    id_coor: number;
    
    municipios: Municipios;
    coordenadas: Coordenadas;
}

export class Lugares {
    constructor(
         id_lug?: number,
         nombre?: string,
         estado?: boolean,
         id_mu?: number,
         id_coor?: number,
         municipios?: Municipios,
         coordenadas?: Coordenadas
    ) {}
}
