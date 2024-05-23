import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Instalaciones } from '../../models/instalaciones/instalaciones';

@Injectable({
  providedIn: 'root',
})
export class InstalacionesService {
  private url = environment.apiUrl + '/instalaciones';

  constructor(private http: HttpClient) {}

  listar(): Observable<Instalaciones[]> {
    return this.http.get<Instalaciones[]>(this.url + '/listar');
  }

  adicionar(instalaciones: Instalaciones): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', instalaciones);
  }

  modificar(instalaciones: Instalaciones): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', instalaciones);
  }

  eliminar(id_ins: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_ins);
  }

  habilitar(id_ins: number): Observable<number> {
    return this.http.get<number>(this.url + '/habilitar/' + id_ins);
  }

  deshabilitar(id_ins: number): Observable<number> {
    return this.http.get<number>(this.url + '/deshabilitar/' + id_ins);
  }
}
