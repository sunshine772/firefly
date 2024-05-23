import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Municipios } from '../../models/municipios/municipios';

@Injectable({
  providedIn: 'root',
})
export class MunicipiosService {
  private url = environment.apiUrl + '/municipios';

  constructor(private http: HttpClient) {}

  listar(): Observable<Municipios[]> {
    return this.http.get<Municipios[]>(this.url + '/listar');
  }

  adicionar(municipios: Municipios): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', municipios);
  }

  modificar(municipios: Municipios): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', municipios);
  }

  eliminar(id_mu: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_mu);
  }

  habilitar(id_mu: number): Observable<number> {
    return this.http.get<number>(this.url + '/habilitar/' + id_mu);
  }

  deshabilitar(id_mu: number): Observable<number> {
    return this.http.get<number>(this.url + '/deshabilitar/' + id_mu);
  }
}
