import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Reclamos } from '../../models/reclamos/reclamos';

@Injectable({
  providedIn: 'root',
})
export class ReclamosService {
  private url = environment.apiUrl + '/reclamos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Reclamos[]> {
    return this.http.get<Reclamos[]>(this.url + '/listar');
  }

  adicionar(reclamos: Reclamos): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', reclamos);
  }

  modificar(reclamos: Reclamos): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', reclamos);
  }

  eliminar(id_rec: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_rec);
  }

  habilitar(id_rec: number): Observable<number> {
    return this.http.get<number>(this.url + '/habilitar/' + id_rec);
  }

  deshabilitar(id_rec: number): Observable<number> {
    return this.http.get<number>(this.url + '/deshabilitar/' + id_rec);
  }
}
