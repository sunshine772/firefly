import { Empleados } from '../empleados/empleados';
import { Clientes } from '../clientes/clientes';
import { Roles } from '../roles/roles';

export interface Usuarios {
  id_usu: number;
  username: string;
  password: string;
  estado: boolean;
  intentos_fallidos: number;
  id_p: number;

  empleados: Empleados;
  clientes: Clientes;
  roles: Roles;
}

export class Usuarios {
  constructor(
    id_usu?: number,
    username?: string,
    password?: string,
    estado?: boolean,
    intentos_fallidos?: number,
    id_p?: number,

    empleados?: Empleados,
    clientes?: Clientes,
    roles?: Roles
  ) {}
}
