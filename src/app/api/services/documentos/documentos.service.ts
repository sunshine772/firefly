import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Documentos } from '../../models/documentos/documentos';

@Injectable({
  providedIn: 'root',
})
export class DocumentossService {
  private url = environment.apiUrl + '/documentoss';

  constructor(private http: HttpClient) {}

  listar(): Observable<Documentos[]> {
    return this.http.get<Documentos[]>(this.url + '/listar');
  }

  extraer(id_doc: number): Observable<Blob> {
    return this.http.get(this.url + '/extraer/' + id_doc, { responseType: 'blob' });
  }

  adicionar(documentos: FormData): Observable<number> {
    return this.http.post<number>(this.url + '/adicionar', documentos);
  }

  modificar(id_doc: number, documentos: FormData): Observable<string> {
    return this.http.put<string>(this.url + '/modificar/' + id_doc, documentos);
  }

  eliminar(id_doc: number): Observable<string> {
    return this.http.delete<string>(this.url + '/eliminar/' + id_doc);
  }

  habilitar(id_doc: number): Observable<string> {
    return this.http.put<string>(this.url + '/habilitar/' + id_doc, {});
  }

  deshabilitar(id_doc: number): Observable<string> {
    return this.http.put<string>(this.url + '/deshabilitar/' + id_doc, {});
  }
}
