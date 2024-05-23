import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subordinados } from 'src/app/models/subordinados/subordinados';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubordinadosService {
  private url = environment.apiUrl + '/subordinados';

  constructor(private http: HttpClient) {}

  listar(): Observable<Subordinados[]> {
    return this.http.get<Subordinados[]>(this.url + '/listar');
  }

  adicionar(subordinados: Subordinados): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', subordinados);
  }

  modificar(subordinados: Subordinados): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', subordinados);
  }

  eliminar(ci: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + ci);
  }
}
