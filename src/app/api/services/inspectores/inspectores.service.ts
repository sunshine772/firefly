import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inspectores } from '../../models/inspectores/inspectores';

@Injectable({
  providedIn: 'root',
})
export class InspectoresService {
  private url = environment.apiUrl + '/inspectores';

  constructor(private http: HttpClient) {}

  listar(): Observable<Inspectores[]> {
    return this.http.get<Inspectores[]>(this.url + '/listar');
  }

  adicionar(inspectores: Inspectores): Observable<Inspectores> {
    return this.http.post<Inspectores>(this.url + '/adicionar', inspectores);
  }

  modificar(inspectores: Inspectores): Observable<Inspectores> {
    return this.http.put<Inspectores>(this.url + '/modificar', inspectores);
  }

  eliminar(id_insp: number): Observable<Inspectores> {
    return this.http.delete<Inspectores>(this.url + '/eliminar/' + id_insp);
  }

  habilitar(id_insp: number): Observable<Inspectores> {
    return this.http.get<Inspectores>(this.url + '/habilitar/' + id_insp);
  }

  deshabilitar(id_insp: number): Observable<Inspectores> {
    return this.http.get<Inspectores>(this.url + '/deshabilitar/' + id_insp);
  }
}
