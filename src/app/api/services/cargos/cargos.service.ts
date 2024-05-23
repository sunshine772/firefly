import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cargos } from '../../models/cargos/cargos';

@Injectable({
  providedIn: 'root',
})
export class CargosService {
  private url = environment.apiUrl + '/cargos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Cargos[]> {
    return this.http.get<Cargos[]>(this.url + '/listar');
  }

  adicionar(cargo: Cargos): Observable<Cargos> {
    return this.http.post<Cargos>(this.url + '/adicionar', cargo);
  }

  modificar(cargo: Cargos): Observable<Cargos> {
    return this.http.put<Cargos>(this.url + '/modificar', cargo);
  }

  eliminar(id_car: number): Observable<Cargos> {
    return this.http.delete<Cargos>(this.url + '/eliminar/' + id_car);
  }

  habilitar(id_car: number): Observable<Cargos> {
    return this.http.get<Cargos>(this.url + '/habilitar/' + id_car);
  }

  deshabilitar(id_car: number): Observable<Cargos> {
    return this.http.get<Cargos>(this.url + '/deshabilitar/' + id_car);
  }
}
