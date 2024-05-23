import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medidores } from '../../models/medidores/medidores';

@Injectable({
  providedIn: 'root',
})
export class MedidoresService {
  private url = environment.apiUrl + '/medidores';

  constructor(private http: HttpClient) {}

  listar(): Observable<Medidores[]> {
    return this.http.get<Medidores[]>(this.url + '/listar');
  }

  listarNuevos(): Observable<Medidores[]> {
    return this.http.get<Medidores[]>(this.url + '/listar-nuevos');
  }

  listarMedidoresRutas(id_rut: number): Observable<Medidores[]> {
    return this.http.get<Medidores[]>(
      this.url + '/listar-medidores-rutas/' + id_rut
    );
  }

  listarMedidorCliente(id_cli: number): Observable<Medidores[]> {
    return this.http.get<Medidores[]>(this.url + '/listar/' + id_cli);
  }

  adicionar(medidores: Medidores): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', medidores);
  }

  modificar(medidores: Medidores): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', medidores);
  }

  eliminar(id_med: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_med);
  }

  habilitar(id_med: number): Observable<number> {
    return this.http.get<number>(this.url + '/habilitar/' + id_med);
  }

  deshabilitar(id_med: number): Observable<number> {
    return this.http.get<number>(this.url + '/deshabilitar/' + id_med);
  }
}
