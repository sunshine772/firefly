import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private url = environment.apiUrl + '/reportes';

  constructor(private http: HttpClient) {}


  generarJson(formData: FormData): Observable<number> {    
    return this.http.post<number>(this.url + '/generar-json', formData);
  }

}
