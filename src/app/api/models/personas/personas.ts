import { Imagenes } from '../imagenes/imagenes';
import { Usuarios } from '../usuarios/usuarios';

export interface Personas {
  id_p: number;
  ci: string;
  nombre: string;
  ap: string;
  am: string;
  estado: boolean;
  fecha_nacimiento: string;
  telefono: string;
  sexo: string;
  estado_civil: string;
  id_img: number;

  usuarios: Usuarios;
  imagenes: Imagenes;
}

export class Personas {
  constructor(
    id_p?: number,
    ci?: string,
    nombre?: string,
    ap?: string,
    am?: string,
    estado?: boolean,
    fecha_nacimiento?: string,
    telefono?: string,
    sexo?: string,
    estado_civil?: string,
    id_img?: number
  ) {}
}
