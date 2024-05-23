import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuarios } from '../../models/usuarios/usuarios';
import { Router } from '@angular/router';
import { Tokens } from '../../models/tokens/tokens';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.apiUrl + '/usuarios';

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private http: HttpClient
  ) {}

  login(usuario: Usuarios): Observable<any> {
    return this.http.post<any>(this.url + '/login', usuario);
  }

  logout(token: Tokens): Observable<any> {
    this.cookieService.deleteAll();
    this.router.navigateByUrl('/auth/login');
    return this.http.post<any>(this.url + '/logout', token);
  }

  verificarToken(token: Tokens): Observable<boolean> {
    return this.http.post<boolean>(this.url + '/verificar', token);
  }
}
