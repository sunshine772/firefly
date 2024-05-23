import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Calles } from '../../models/calles/calles';

@Injectable({
  providedIn: 'root',
})
export class CallesService {
  private url = environment.apiUrl + '/calles';

  constructor(private http: HttpClient) {}

  listar(): Observable<Calles[]> {
    return this.http.get<Calles[]>(this.url + '/listar');
  }

  adicionar(calle: Calles): Observable<Calles> {
    return this.http.post<Calles>(this.url + '/adicionar', calle);
  }

  modificar(calle: Calles): Observable<Calles> {
    return this.http.put<Calles>(this.url + '/modificar', calle);
  }

  eliminar(id_calle: number): Observable<Calles> {
    return this.http.delete<Calles>(this.url + '/eliminar/' + id_calle);
  }

  habilitar(id_calle: number): Observable<Calles> {
    return this.http.get<Calles>(this.url + '/habilitar/' + id_calle);
  }

  deshabilitar(id_calle: number): Observable<Calles> {
    return this.http.get<Calles>(this.url + '/deshabilitar/' + id_calle);
  }
}
