import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tarifas } from '../../models/tarifas/tarifas';

@Injectable({
  providedIn: 'root',
})
export class TarifasService {
  private url = environment.apiUrl + '/tarifas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Tarifas[]> {
    return this.http.get<Tarifas[]>(this.url + '/listar');
  }

  adicionar(tarifas: Tarifas): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', tarifas);
  }

  modificar(tarifas: Tarifas): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', tarifas);
  }

  eliminar(id_tar: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_tar);
  }

  habilitar(id_tar: number): Observable<number> {
    return this.http.get<number>(this.url + '/habilitar/' + id_tar);
  }

  deshabilitar(id_tar: number): Observable<number> {
    return this.http.get<number>(this.url + '/deshabilitar/' + id_tar);
  }

  verificar(tarifas: Tarifas): Observable<boolean> {
    const body = {
      id_tar: tarifas.id_tar,
      fecha: tarifas.fecha,
      tipo_tar: tarifas.tipo_tar,
    };

    return this.http.post<boolean>(this.url + '/verificar', body);
  }
}
