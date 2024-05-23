import { Clientes } from "../clientes/clientes";
import { Coordenadas } from "../coordenadas/coordenadas";

export interface Medidores {
    id_med: number;
    tipo_med: string;
    estado: boolean;
    id_cli: number;
    id_coor: number;
    
    clientes: Clientes;
    coordenadas: Coordenadas;
}

export class Medidores {
    constructor(
         id_med?: number,
         tipo_med?: string,
         estado?: boolean,
         id_cli?: number,
         id_coor?: number,
         clientes?: Clientes,
         coordenadas?: Coordenadas
    ) {}
}
