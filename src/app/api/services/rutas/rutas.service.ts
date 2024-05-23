import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Rutas } from '../../models/rutas/rutas';

@Injectable({
  providedIn: 'root',
})
export class RutasService {
  private url = environment.apiUrl + '/rutas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Rutas[]> {
    return this.http.get<Rutas[]>(this.url + '/listar');
  }

  adicionar(rutas: Rutas): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', rutas);
  }

  adicionarCoordenadaARuta(
    id_coor: number,
    id_rut: number
  ): Observable<number> {
    return this.http.post<number>(
      this.url +
        '/adicionar-coordenada-ruta' +
        '?id_coor=' +
        id_coor +
        '&id_rut=' +
        id_rut,
      null
    );
  }

  modificar(rutas: Rutas): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', rutas);
  }

  eliminar(id_rut: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_rut);
  }

  habilitar(id_rut: number): Observable<number> {
    return this.http.get<number>(this.url + '/habilitar/' + id_rut);
  }

  deshabilitar(id_rut: number): Observable<number> {
    return this.http.get<number>(this.url + '/deshabilitar/' + id_rut);
  }

  adicionarMedidorRuta(formData: FormData): Observable<number> {
    return this.http.post<number>(
      this.url + '/adicionar-medidor-ruta',
      formData
    );
  }

  eliminarMedidorRuta(id_rut: number, id_med: number): Observable<number> {
    const params = new HttpParams()
      .set('id_rut', id_rut.toString())
      .set('id_med', id_med.toString());

    return this.http.delete<number>(this.url + '/eliminar-medidor-ruta', {
      params,
    });
  }
}
