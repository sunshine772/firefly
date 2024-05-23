import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../services/layout/layout.service';
import { Routes } from '@angular/router';
import { AuthService } from 'src/app/api/services/auth/auth.service';
import { CookieService } from 'src/app/api/services/cookie/cookie.service';
import { Tokens } from 'src/app/api/models/tokens/tokens';
import { Menus } from 'src/app/api/models/menus/menus';
import { Procesos } from 'src/app/api/models/procesos/procesos';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  private token = new Tokens();

  items!: MenuItem[];

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    const roles = this.cookieService.getCookie('roles')
      ? JSON.parse(this.cookieService.getCookie('roles'))
      : null;

    if (roles && roles[0] && roles[0].menus) {
      this.items = roles[0].menus.map((menu: Menus) => ({
        label: menu.nombre,
        icon: menu.icono,
        items: menu.procesos.map((proceso: Procesos) => ({
          label: proceso.nombre,
          icon: proceso.icono,
          routerLink: proceso.enlace,
        })),
      }));
    } else {
      this.items = [];
    }

    // this.items = [
    //   {
    //     label: 'Servicios',
    //     icon: 'pi pi-file',
    //     items: [
    //       {
    //         label: 'Solicitudes',
    //         icon: 'pi pi-send',
    //         routerLink: '/panel/solicitudes',
    //       },
    //       {
    //         label: 'Ampliaciones',
    //         icon: 'pi pi-plus',
    //         routerLink: '/panel/ampliaciones',
    //       },
    //       {
    //         label: 'Instalaciones',
    //         icon: 'pi pi-desktop',
    //         routerLink: '/panel/instalaciones',
    //       },
    //       {
    //         label: 'Reclamos',
    //         icon: 'pi pi-user-minus',
    //         routerLink: '/panel/reclamos',
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Personas',
    //     icon: 'pi pi-users',
    //     items: [
    //       {
    //         label: 'Clientes',
    //         icon: 'pi pi-user',
    //         routerLink: '/panel/clientes',
    //       },
    //       {
    //         label: 'Consumos',
    //         icon: 'pi pi-chart-bar',
    //         routerLink: '/panel/consumos',
    //       },
    //       {
    //         label: 'Lecturaciones',
    //         icon: 'pi pi-chart-line',
    //         routerLink: '/panel/lecturaciones',
    //       },
    //       {
    //         label: 'Tarifas',
    //         icon: 'pi pi-chart-pie',
    //         routerLink: '/panel/tarifas',
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Operaciones',
    //     icon: 'pi pi-sitemap',
    //     items: [
    //       {
    //         label: 'Operaciones',
    //         icon: 'pi pi-wrench',
    //         routerLink: '/panel/operaciones',
    //       },
    //       {
    //         label: 'Noticias',
    //         icon: 'pi pi-calendar',
    //         routerLink: '/panel/noticias',
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Mapas',
    //     icon: 'pi pi-map',
    //     items: [
    //       // {
    //       //   label: 'Mapa',
    //       //   icon: 'pi pi-map',
    //       //   routerLink: '/panel/mapa',
    //       // },
    //       {
    //         label: 'Lugares',
    //         icon: 'pi pi-image',
    //         routerLink: '/panel/lugares',
    //       },
    //       {
    //         label: 'Municipios',
    //         icon: 'pi pi-flag',
    //         routerLink: '/panel/municipios',
    //       },
    //       {
    //         label: 'Medidores',
    //         icon: 'pi pi-tablet',
    //         routerLink: '/panel/medidores',
    //       },
    //       {
    //         label: 'Postes',
    //         icon: 'pi pi-plus',
    //         routerLink: '/panel/postes',
    //       },
    //       {
    //         label: 'Rutas',
    //         icon: 'pi pi-truck',
    //         routerLink: '/panel/rutas',
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Empresa',
    //     icon: 'pi pi-pencil',
    //     items: [
    //       {
    //         label: 'Áreas',
    //         icon: 'pi pi-globe',
    //         routerLink: '/panel/areas',
    //       },
    //       {
    //         label: 'Cargos',
    //         icon: 'pi pi-sitemap',
    //         routerLink: '/panel/cargos',
    //       },
    //       {
    //         label: 'Empleados',
    //         icon: 'pi pi-user-edit',
    //         routerLink: '/panel/empleados',
    //       },
    //       {
    //         label: 'Subordinados',
    //         icon: 'pi pi-users',
    //         routerLink: '/panel/subordinados',
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Reportes',
    //     icon: 'pi pi-print',
    //     items: [
    //       {
    //         label: 'Reportes',
    //         icon: 'pi pi-file-pdf',
    //         routerLink: '/panel/reportes',
    //       },
    //     ],
    //   },
    // ];
  }

  logout() {
    this.token = this.cookieService.getCookie('token')
      ? JSON.parse(this.cookieService.getCookie('token'))
      : null;
    this.authService
      .logout(this.token)
      // .pipe(
      //   catchError((error) => {
      //     // this.toastService.presentToast(
      //     //   'Error',
      //     //   error.error,
      //     //   'bottom',
      //     //   'danger',
      //     //   2000
      //     // );
      //     return throwError(error);
      //   })
      // )
      .subscribe((res) => {});
  }
}
