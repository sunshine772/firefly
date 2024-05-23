import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Operaciones } from '../../models/operaciones/operaciones';

@Injectable({
  providedIn: 'root',
})
export class OperacionesService {
  private url = environment.apiUrl + '/operaciones';

  constructor(private http: HttpClient) {}

  listar(): Observable<Operaciones[]> {
    return this.http.get<Operaciones[]>(this.url + '/listar');
  }

  adicionar(operaciones: Operaciones): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', operaciones);
  }

  modificar(operaciones: Operaciones): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', operaciones);
  }

  eliminar(id_op: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_op);
  }

  habilitar(id_op: number): Observable<number> {
    return this.http.get<number>(this.url + '/habilitar/' + id_op);
  }

  deshabilitar(id_op: number): Observable<number> {
    return this.http.get<number>(this.url + '/deshabilitar/' + id_op);
  }
}
