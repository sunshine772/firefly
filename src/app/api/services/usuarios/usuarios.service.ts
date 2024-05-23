import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Usuarios } from '../../models/usuarios/usuarios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private url = environment.apiUrl + '/usuarios';

  @Output() usuario: EventEmitter<Usuarios> = new EventEmitter();

  private id_usu = new Subject<number>();
  Id_usu = this.id_usu.asObservable();

  constructor(private http: HttpClient) { }

  login(usuario: Usuarios): Observable<boolean> {
    return this.http.post<boolean>(this.url + '/conectar', usuario);
  }

  logout() {
    return this.http.get(this.url + '/desconectar');
  }

  listar(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(this.url + '/listar');
  }

  adicionar(usuarios: Usuarios): Observable<Usuarios[]> {
    return this.http.post<Usuarios[]>(this.url + '/adicionar', usuarios);
  }

  modificar(usuarios: Usuarios): Observable<Usuarios[]> {
    return this.http.put<Usuarios[]>(this.url + '/modificar', usuarios);
  }

  habilitar(usuarios: Usuarios): Observable<Usuarios[]> {
    return this.http.put<Usuarios[]>(this.url + '/habilitar', usuarios);
  }

  existe(username: string): Observable<boolean> {
    return this.http.get<boolean>(this.url + '/existe?username='+username);
  }

  enviarUsuario(usuario: Usuarios) {
    this.usuario.emit(usuario);
    sessionStorage.setItem("usuario", JSON.stringify(usuario));
  }

  enviarIdr(id_usu: number) {
    this.id_usu.next(id_usu);
  }
}
