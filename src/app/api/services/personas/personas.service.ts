import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Personas } from '../../models/personas/personas';

@Injectable({
  providedIn: 'root',
})
export class PersonasService {
  private url = environment.apiUrl + '/personas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Personas[]> {
    return this.http.get<Personas[]>(this.url + '/listar');
  }

  adicionar(personas: Personas): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', personas);
  }

  modificar(personas: Personas): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', personas);
  }

  eliminar(id_p: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_p);
  }

  habilitar(id_p: number): Observable<number> {
    return this.http.get<number>(this.url + '/habilitar/' + id_p);
  }

  deshabilitar(id_p: number): Observable<number> {
    return this.http.get<number>(this.url + '/deshabilitar/' + id_p);
  }

  existe(ci: string): Observable<boolean> {
    return this.http.get<boolean>(this.url + '/existe/' + ci);
  }
}
