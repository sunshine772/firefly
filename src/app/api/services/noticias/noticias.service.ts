import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Noticias } from '../../models/noticias/noticias';

@Injectable({
  providedIn: 'root',
})
export class NoticiasService {
  private url = environment.apiUrl + '/noticias';

  constructor(private http: HttpClient) {}

  listar(): Observable<Noticias[]> {
    return this.http.get<Noticias[]>(this.url + '/listar');
  }

  adicionar(noticias: Noticias): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', noticias);
  }

  modificar(noticias: Noticias): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', noticias);
  }

  eliminar(id_not: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_not);
  }

  habilitar(id_not: number): Observable<number> {
    return this.http.get<number>(this.url + '/habilitar/' + id_not);
  }

  deshabilitar(id_not: number): Observable<number> {
    return this.http.get<number>(this.url + '/deshabilitar/' + id_not);
  }
}
