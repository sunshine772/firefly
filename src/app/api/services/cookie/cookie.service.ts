import { Injectable } from '@angular/core';
import { CookieService as NgxCookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  constructor(private ngxCookieService: NgxCookieService) {}

  public setCookie(key: string, value: string, expires?: number, path?: string): void {
    this.ngxCookieService.set(key, value, expires, path);
  }

  public getCookie(key: string): string {
    return this.ngxCookieService.get(key);
  }

  public deleteCookie(key: string, path?: string): void {
    this.ngxCookieService.delete(key, path);
  }
}
