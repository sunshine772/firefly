import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Procesos } from 'src/app/models/procesos/procesos';

@Injectable({
  providedIn: 'root'
})
export class ProcesosService {
  url = 'http://localhost:8080/procesos';

  constructor(private http: HttpClient) { }

  procesos(id_m: number): Observable<Procesos[]> {
    return this.http.get<Procesos[]>(this.url + '/' + id_m);
  }

  listar(): Observable<Procesos[]> {
    return this.http.get<Procesos[]>(this.url + '/listar');
  }

  adicionar(procesos: Procesos): Observable<Procesos[]> {
    return this.http.post<Procesos[]>(this.url + '/adicionar', procesos);
  }

  modificar(procesos: Procesos): Observable<Procesos[]> {
    return this.http.put<Procesos[]>(this.url + '/modificar', procesos);
  }

  habilitar(procesos: Procesos): Observable<Procesos[]> {
    return this.http.put<Procesos[]>(this.url + '/habilitar', procesos);
  }
}
