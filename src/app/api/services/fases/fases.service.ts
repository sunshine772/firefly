import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Fases } from '../../models/fases/fases';

@Injectable({
  providedIn: 'root',
})
export class FasesService {
  private url = environment.apiUrl + '/fases';

  constructor(private http: HttpClient) {}

  listar(): Observable<Fases[]> {
    return this.http.get<Fases[]>(this.url + '/listar');
  }

  adicionar(fases: Fases): Observable<Fases> {
    return this.http.post<Fases>(this.url + '/adicionar', fases);
  }

  modificar(fases: Fases): Observable<Fases> {
    return this.http.put<Fases>(this.url + '/modificar/', fases);
  }

  eliminar(id_fa: number): Observable<Fases> {
    return this.http.delete<Fases>(this.url + '/eliminar/' + id_fa);
  }

  habilitar(id_fa: number): Observable<number> {
    return this.http.get<number>(this.url + '/habilitar/' + id_fa);
  }

  deshabilitar(id_fa: number): Observable<number> {
    return this.http.get<number>(this.url + '/deshabilitar/' + id_fa);
  }
}
