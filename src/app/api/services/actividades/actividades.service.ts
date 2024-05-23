import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Actividades } from '../../models/actividades/actividades';

@Injectable({
  providedIn: 'root',
})
export class ActividadesService {
  private url = environment.apiUrl + '/actividades';

  constructor(private http: HttpClient) {}

  listarActividadesOperaciones(id_op: number): Observable<Actividades[]> {
    return this.http.get<Actividades[]>(this.url + '/' + id_op);
  }

  listar(): Observable<Actividades[]> {
    return this.http.get<Actividades[]>(this.url + '/listar');
  }

  adicionar(actividades: Actividades): Observable<Actividades[]> {
    return this.http.post<Actividades[]>(this.url + '/adicionar', actividades);
  }

  modificar(actividades: Actividades): Observable<Actividades[]> {
    return this.http.put<Actividades[]>(this.url + '/modificar', actividades);
  }

  eliminar(id_act: number): Observable<Actividades[]> {
    return this.http.delete<Actividades[]>(this.url + '/eliminar' + id_act);
  }

  habilitar(id_act: number): Observable<number> {
    return this.http.get<number>(this.url + '/habilitar/' + id_act);
  }

  deshabilitar(id_act: number): Observable<number> {
    return this.http.get<number>(this.url + '/deshabilitar/' + id_act);
  }
}
