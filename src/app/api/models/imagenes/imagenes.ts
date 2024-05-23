export interface Imagenes {
    id_img: number;
    nombre: string;
    imagen: string; 
    tipo: string;
    tamanio: number; 
    fecha_creacion: string;
    fecha_modificacion: string;
    estado: boolean;
}

export class Imagenes {
    constructor(
         id_img?: number,
         nombre?: string,
         imagen?: string, 
         tipo?: string,
         tamanio?: number, 
         fecha_creacion?: string,
         fecha_modificacion?: string,
         estado?: boolean
    ) {}
}
