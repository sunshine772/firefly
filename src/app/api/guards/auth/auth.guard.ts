import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {

    // Aquí verificamos si la cookie "token" existe
    const isAuthenticated = this.cookieService.check('token');

    if (isAuthenticated) {
      return true;
    } else {
      // Si el usuario no ha iniciado sesión, redirige a la página de inicio de sesión.
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}
