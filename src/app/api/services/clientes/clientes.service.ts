import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Clientes } from '../../models/clientes/clientes';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private url = environment.apiUrl + '/clientes';

  constructor(private http: HttpClient) {}

  listar(): Observable<Clientes[]> {
    return this.http.get<Clientes[]>(this.url + '/listar');
  }

  adicionar(cliente: Clientes): Observable<Clientes> {
    return this.http.post<Clientes>(this.url + '/adicionar', cliente);
  }

  modificar(cliente: Clientes): Observable<Clientes> {
    return this.http.put<Clientes>(this.url + '/modificar', cliente);
  }

  eliminar(ci: number): Observable<Clientes> {
    return this.http.delete<Clientes>(this.url + '/eliminar/' + ci);
  }

  buscar(ci: string): Observable<Clientes[]>  {
    return this.http.get<Clientes[]>(this.url + '/buscar/' + ci);
  }
}
