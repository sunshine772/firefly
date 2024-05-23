import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Lugares } from '../../models/lugares/lugares';

@Injectable({
  providedIn: 'root',
})
export class LugaresService {
  private url = environment.apiUrl + '/lugares';

  constructor(private http: HttpClient) {}

  listar(): Observable<Lugares[]> {
    return this.http.get<Lugares[]>(this.url + '/listar');
  }

  listarPorMunicipio(id_mu: number): Observable<Lugares[]> {
    return this.http.get<Lugares[]>(this.url + '/listarPorMunicipio/' + id_mu);
  }

  adicionar(lugares: Lugares): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', lugares);
  }

  modificar(lugares: Lugares): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', lugares);
  }

  eliminar(id_lug: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_lug);
  }

  habilitar(id_lug: number): Observable<number> {
    return this.http.get<number>(this.url + '/habilitar/' + id_lug);
  }

  deshabilitar(id_lug: number): Observable<number> {
    return this.http.get<number>(this.url + '/deshabilitar/' + id_lug);
  }
}
