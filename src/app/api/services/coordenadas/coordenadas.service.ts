import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coordenadas } from '../../models/coordenadas/coordenadas';

@Injectable({
  providedIn: 'root',
})
export class CoordenadasService {
  private url = environment.apiUrl + '/coordenadas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Coordenadas[]> {
    return this.http.get<Coordenadas[]>(this.url + '/listar');
  }

  adicionar(coordenadas: Coordenadas): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', coordenadas);
  }

  modificar(coordenadas: Coordenadas): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', coordenadas);
  }

  eliminar(id_coor: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_coor);
  }

  coordenada(): Observable<number> {
    return this.http.get<number>(this.url + '/id');
  }
}
