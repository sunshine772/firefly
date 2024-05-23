import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Consumos } from '../../models/consumos/consumos';
import { Lecturaciones } from '../../models/lecturaciones/lecturaciones';

@Injectable({
  providedIn: 'root',
})
export class ConsumosService {
  private url = environment.apiUrl + '/consumos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Consumos[]> {
    return this.http.get<Consumos[]>(this.url + '/listar');
  }

  adicionar(consumo: Consumos): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', consumo);
  }

  modificar(consumo: Consumos): Observable<number> {
    return this.http.put<number>(this.url + '/modificar/', consumo);
  }

  eliminar(id_cons: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_cons);
  }

  adicionarConsumos(lecturaciones: Lecturaciones[]): Observable<any> {
    return this.http.post<any>(this.url + '/adicionar-consumos', lecturaciones);
  }
}
