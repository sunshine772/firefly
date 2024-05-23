import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Menus } from 'src/app/models/menus/menus';
import { Roles } from 'src/app/models/roles/roles';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private url = 'http://localhost:8080/roles';

  @Output() rol: EventEmitter<Roles> = new EventEmitter();

  constructor(private http: HttpClient) { }

  roles(id_usu: number): Observable<Roles[]> {
    return this.http.get<Roles[]>(this.url + '/' + id_usu);
  }

  listar(): Observable<Roles[]> {
    return this.http.get<Roles[]>(this.url + '/listar');
  }

  adicionar(roles: Roles): Observable<Roles[]> {
    return this.http.post<Roles[]>(this.url + '/adicionar', roles);
  }

  modificar(roles: Roles): Observable<Roles[]> {
    return this.http.put<Roles[]>(this.url + '/modificar', roles);
  }

  habilitar(roles: Roles): Observable<Roles[]> {
    return this.http.put<Roles[]>(this.url + '/habilitar', roles);
  }

  enviarRol(rol: Roles) {
    this.rol.emit(rol);
    sessionStorage.setItem("rol", JSON.stringify(rol));
  }
}
