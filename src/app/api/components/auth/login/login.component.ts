import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Usuarios } from 'src/app/api/models/usuarios/usuarios';
import { AuthService } from 'src/app/api/services/auth/auth.service';
import { CookieService } from 'src/app/api/services/cookie/cookie.service';
import { LayoutService } from 'src/app/layout/services/layout/layout.service';
declare var particlesJS: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private usuario = new Usuarios();

  registerForm!: FormGroup;
  submitted: boolean = false;

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    // private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    particlesJS.load('particles-js', 'assets/particles.json', function () {
      // console.log('callback - particles.js config loaded');
    });

    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.usuario.username = this.registerForm.get('username')?.value;
    this.usuario.password = this.registerForm.get('password')?.value;

    console.log(this.usuario);

    this.authService
      .login(this.usuario)
      // .pipe(
      //   catchError((error) => {
      //     if (error.status == 401) {
      //       this.messageService.add({
      //         severity: 'error',
      //         summary: 'Error',
      //         detail: '',
      //         life: 3000,
      //       });
      //     } else {
      //       this.messageService.add({
      //         severity: 'error',
      //         summary: 'Error',
      //         detail: '',
      //         life: 3000,
      //       });
      //     }
      //     return throwError(error);
      //   })
      // )
      .subscribe((res) => {
        console.log(res);

        const token = res.token;
        const usuario = res.usuario;
        const roles = res.roles;

        this.cookieService.setCookie('token', JSON.stringify(token));
        this.cookieService.setCookie('usuario', JSON.stringify(usuario));
        this.cookieService.setCookie('roles', JSON.stringify(roles));

        this.router.navigate(['/']);
      });
  }
}
