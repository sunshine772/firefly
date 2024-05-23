import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Imagenes } from '../../models/imagenes/imagenes';

@Injectable({
  providedIn: 'root',
})
export class ImagenesService {
  private url = environment.apiUrl + '/imagenes';

  constructor(private http: HttpClient) {}

  listar(): Observable<Imagenes[]> {
    return this.http.get<Imagenes[]>(this.url + '/listar');
  }

  extraer(id_img: number): Observable<Blob> {
    return this.http.get(this.url + '/extraer/' + id_img, {
      responseType: 'blob',
    });
  }

  adicionar(imagen: File): Observable<number> {
    const formData: FormData = new FormData();
    formData.append('imagen', imagen);

    return this.http.post<number>(this.url + '/adicionar', formData);
  }

  modificar(formData: FormData): Observable<number> {
    return this.http.put<number>(this.url + '/modificar/', formData);
  }

  eliminar(id_img: number): Observable<Imagenes> {
    return this.http.delete<Imagenes>(this.url + '/eliminar/' + id_img);
  }

  habilitar(id_img: number): Observable<Imagenes> {
    return this.http.get<Imagenes>(this.url + '/habilitar/' + id_img);
  }

  deshabilitar(id_img: number): Observable<Imagenes> {
    return this.http.get<Imagenes>(this.url + '/deshabilitar/' + id_img);
  }
}
