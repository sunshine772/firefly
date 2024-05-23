import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Lineas } from '../../models/lineas/lineas';

@Injectable({
  providedIn: 'root',
})
export class LineasService {
  private url = environment.apiUrl + '/lineas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Lineas[]> {
    return this.http.get<Lineas[]>(this.url + '/listar');
  }

  adicionar(lineas: Lineas): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', lineas);
  }

  modificar(lineas: Lineas): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', lineas);
  }

  eliminar(id_lin: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_lin);
  }

  habilitar(id_lin: number): Observable<number> {
    return this.http.get<number>(this.url + '/habilitar/' + id_lin);
  }

  deshabilitar(id_lin: number): Observable<number> {
    return this.http.get<number>(this.url + '/deshabilitar/' + id_lin);
  }

  linea(): Observable<number> {
    return this.http.get<number>(this.url + '/id');
  }
}
