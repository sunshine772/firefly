import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Menus } from 'src/app/models/menus/menus';
import { Procesos } from 'src/app/models/procesos/procesos';

@Injectable({
  providedIn: 'root'
})
export class MenusService {
  private url = 'http://localhost:8080/menus';

  private proceso = new Subject<Procesos[]>();
  Proceso = this.proceso.asObservable();

  private id_m = new Subject<number>();
  Id_m = this.id_m.asObservable();

  constructor(private http: HttpClient) { }

  menus(codr: number): Observable<Menus[]> {
    return this.http.get<Menus[]>(this.url + '/' + codr);
  }

  listar(): Observable<Menus[]> {
    return this.http.get<Menus[]>(this.url + '/listar');
  }

  adicionar(menus: Menus): Observable<Menus[]> {
    return this.http.post<Menus[]>(this.url + '/adicionar', menus);
  }

  modificar(menus: Menus): Observable<Menus[]> {
    return this.http.put<Menus[]>(this.url + '/modificar', menus);
  }

  habilitar(menus: Menus): Observable<Menus[]> {
    return this.http.put<Menus[]>(this.url + '/habilitar', menus);
  }

  enviarProceso(procesos: any) {
    this.proceso.next(procesos);
  }

  enviarIdm(id_m: number) {
    this.id_m.next(id_m);
  }
}
