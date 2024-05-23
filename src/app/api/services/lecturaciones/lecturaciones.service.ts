import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Lecturaciones } from '../../models/lecturaciones/lecturaciones';

@Injectable({
  providedIn: 'root',
})
export class LecturacionesService {
  private url = environment.apiUrl + '/lecturaciones';

  constructor(private http: HttpClient) {}

  listar(): Observable<Lecturaciones[]> {
    return this.http.get<Lecturaciones[]>(this.url + '/listar');
  }

  adicionar(lecturaciones: Lecturaciones): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', lecturaciones);
  }

  modificar(lecturaciones: Lecturaciones): Observable<number> {
    return this.http.put<number>(this.url + '/modificar', lecturaciones);
  }

  eliminar(id_lec: number): Observable<number> {
    return this.http.delete<number>(this.url + '/eliminar/' + id_lec);
  }

  adicionarLecturaciones(file: File): Observable<number> {
    const formData: FormData = new FormData();
    formData.append('lecturaciones', file, file.name);
    return this.http.post<number>(this.url + '/adicionar', formData);
  }

}
