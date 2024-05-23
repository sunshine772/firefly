import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Responsables } from '../../models/responsables/responsables';

@Injectable({
  providedIn: 'root',
})
export class ResponsablesService {
  private url = environment.apiUrl + '/responsables';

  constructor(private http: HttpClient) {}

  listar(): Observable<Responsables[]> {
    return this.http.get<Responsables[]>(this.url + '/listar');
  }

  adicionar(responsables: Responsables): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', responsables);
  }

  modificar(responsables: Responsables): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', responsables);
  }

  eliminar(id_res: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_res);
  }

  habilitar(id_res: number): Observable<number> {
    return this.http.get<number>(this.url + '/habilitar/' + id_res);
  }

  deshabilitar(id_res: number): Observable<number> {
    return this.http.get<number>(this.url + '/deshabilitar/' + id_res);
  }
}
