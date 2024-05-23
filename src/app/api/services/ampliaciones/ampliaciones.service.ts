import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ampliaciones } from '../../models/ampliaciones/ampliaciones';

@Injectable({
  providedIn: 'root',
})
export class AmpliacionesService {
  private url = environment.apiUrl + '/ampliaciones';

  constructor(private http: HttpClient) {}

  listar(): Observable<Ampliaciones[]> {
    return this.http.get<Ampliaciones[]>(this.url + '/listar');
  }

  adicionar(ampliaciones: Ampliaciones): Observable<Ampliaciones> {
    return this.http.post<Ampliaciones>(this.url + '/adicionar', ampliaciones);
  }

  modificar(ampliaciones: Ampliaciones): Observable<Ampliaciones> {
    return this.http.put<Ampliaciones>(this.url + '/modificar', ampliaciones);
  }

  eliminar(id_amp: number): Observable<Ampliaciones> {
    return this.http.delete<Ampliaciones>(this.url + '/eliminar/' + id_amp);
  }

  habilitar(id_amp: number): Observable<Ampliaciones> {
    return this.http.get<Ampliaciones>(this.url + '/habilitar/' + id_amp);
  }

  deshabilitar(id_amp: number): Observable<Ampliaciones> {
    return this.http.get<Ampliaciones>(this.url + '/deshabilitar/' + id_amp);
  }
}
