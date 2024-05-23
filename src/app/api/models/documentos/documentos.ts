export interface Documentos {
  id_doc: number;
  nombre: string;
  documento: string;
  tipo: string;
  tamanio: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  estado: boolean;
}

export class Documentos {
  constructor(
       id_doc?: number,
       nombre?: string,
       documento?: string,
       tipo?: string,
       tamanio?: number,
       fecha_creacion?: string,
       fecha_modificacion?: string,
       estado?: boolean
  ) {}
}
