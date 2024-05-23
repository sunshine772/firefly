import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Empleados } from '../../models/empleados/empleados';

@Injectable({
  providedIn: 'root',
})
export class EmpleadosService {
  private url = environment.apiUrl + '/empleados';

  constructor(private http: HttpClient) {}

  listar(): Observable<Empleados[]> {
    return this.http.get<Empleados[]>(this.url + '/listar');
  }

  adicionar(empleados: Empleados): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', empleados);
  }

  modificar(empleados: Empleados): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', empleados);
  }

  eliminar(ci: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + ci);
  }
}
