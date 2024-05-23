import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Solicitudes } from '../../models/solicitudes/solicitudes';

@Injectable({
  providedIn: 'root',
})
export class SolicitudesService {
  private url = environment.apiUrl + '/solicitudes';

  constructor(private http: HttpClient) {}

  listar(): Observable<Solicitudes[]> {
    return this.http.get<Solicitudes[]>(this.url + '/listar');
  }

  adicionar(solicitudes: Solicitudes): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', solicitudes);
  }

  modificar(solicitudes: Solicitudes): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', solicitudes);
  }

  eliminar(id_s: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_s);
  }

  aceptar(id_s: number): Observable<number> {
    return this.http.get<number>(this.url + '/aceptar/' + id_s);
  }

  rechazar(id_s: number): Observable<number> {
    return this.http.get<number>(this.url + '/rechazar/' + id_s);
  }
}
