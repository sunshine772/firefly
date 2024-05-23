import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Postes } from '../../models/postes/postes';

@Injectable({
  providedIn: 'root',
})
export class PostesService {
  private url = environment.apiUrl + '/postes';

  constructor(private http: HttpClient) {}

  listar(): Observable<Postes[]> {
    return this.http.get<Postes[]>(this.url + '/listar');
  }

  adicionar(postes: Postes): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', postes);
  }

  modificar(postes: Postes): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', postes);
  }

  eliminar(id_pos: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_pos);
  }

  habilitar(id_pos: number): Observable<number> {
    return this.http.get<number>(this.url + '/habilitar/' + id_pos);
  }

  deshabilitar(id_pos: number): Observable<number> {
    return this.http.get<number>(this.url + '/deshabilitar/' + id_pos);
  }

  poste(): Observable<number> {
    return this.http.get<number>(this.url + '/id');
  }
}
