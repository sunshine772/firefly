import { Imagenes } from '../imagenes/imagenes';

export interface Noticias {
  id_not: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  estado: boolean;
  id_usu: number;
  id_img: number;

  imagenes: Imagenes;
}

export class Noticias {
  constructor(
    id_not?: number,
    titulo?: string,
    descripcion?: string,
    fecha?: string,
    hora?: string,
    estado?: boolean,
    id_usu?: number,
    id_img?: number,
    imagenes?: Imagenes
  ) {}
}
