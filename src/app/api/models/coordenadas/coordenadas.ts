export interface Coordenadas {
    id_coor: number;
    latitud: number;
    longitud: number;
}

export class Coordenadas {
    constructor(
         id_coor?: number,
         latitud?: number,
         longitud?: number
    ) {}
}
