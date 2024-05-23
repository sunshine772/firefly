import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Areas } from '../../models/areas/areas';

@Injectable({
  providedIn: 'root',
})
export class AreasService {
  private url = environment.apiUrl + '/areas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Areas[]> {
    return this.http.get<Areas[]>(this.url + '/listar');
  }

  adicionar(area: Areas): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', area);
  }

  modificar(area: Areas): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', area);
  }

  eliminar(id_a: Areas): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_a);
  }

  habilitar(id_a: number): Observable<number> {
    return this.http.get<number>(this.url + '/habilitar/' + id_a);
  }

  deshabilitar(id_a: number): Observable<number> {
    return this.http.get<number>(this.url + '/deshabilitar/' + id_a);
  }
}
