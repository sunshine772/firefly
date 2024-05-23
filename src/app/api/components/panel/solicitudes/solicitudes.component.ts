import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { Ampliaciones } from 'src/app/api/models/ampliaciones/ampliaciones';
import { Clientes } from 'src/app/api/models/clientes/clientes';
import { Coordenadas } from 'src/app/api/models/coordenadas/coordenadas';
import { Empleados } from 'src/app/api/models/empleados/empleados';
import { Inspectores } from 'src/app/api/models/inspectores/inspectores';
import { Instalaciones } from 'src/app/api/models/instalaciones/instalaciones';
import { Lugares } from 'src/app/api/models/lugares/lugares';
import { Municipios } from 'src/app/api/models/municipios/municipios';
import { Reclamos } from 'src/app/api/models/reclamos/reclamos';
import { Solicitudes } from 'src/app/api/models/solicitudes/solicitudes';
import { AmpliacionesService } from 'src/app/api/services/ampliaciones/ampliaciones.service';
import { ClientesService } from 'src/app/api/services/clientes/clientes.service';
import { CookieService } from 'src/app/api/services/cookie/cookie.service';
import { CoordenadasService } from 'src/app/api/services/coordenadas/coordenadas.service';
import { InspectoresService } from 'src/app/api/services/inspectores/inspectores.service';
import { InstalacionesService } from 'src/app/api/services/instalaciones/instalaciones.service';
import { LugaresService } from 'src/app/api/services/lugares/lugares.service';
import { MunicipiosService } from 'src/app/api/services/municipios/municipios.service';
import { ReclamosService } from 'src/app/api/services/reclamos/reclamos.service';
import { MapaSolicitudService } from 'src/app/api/services/solicitudes/mapa-solicitud/mapa-solicitud.service';
import { SolicitudesService } from 'src/app/api/services/solicitudes/solicitudes.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss'],
  providers: [MessageService],
})
export class SolicitudesComponent {
  ampliacion = new Ampliaciones();
  instalcion = new Instalaciones();
  reclamo = new Reclamos();
  coordenada = new Coordenadas();
  empleado = new Empleados();

  solicitud = new Solicitudes();
  solicitudes: Solicitudes[] = [];
  clientes: Clientes[] = [];
  filteredClientes: Clientes[] = [];

  municipios: Municipios[] = [];
  lugares: Lugares[] = [];

  inspectores: Inspectores[] = [];
  filteredLugares: Lugares[] = [];

  Add!: FormGroup;
  submittedAdd = false;
  Mod!: FormGroup;
  submittedMod = false;
  Insp!: FormGroup;
  submittedInsp = false;

  Enable!: FormGroup;
  submittedEnable = false;
  Disable!: FormGroup;
  submittedDisable = false;

  modalAdd: boolean = false;
  modalMod: boolean = false;
  modalInsp: boolean = false;

  modalAcc: boolean = false;
  modalDec: boolean = false;

  itemSelected: string = '';
  id_s: number = 0;

  cols: any[] = [];
  tipo_solicitud: any[] = [];

  notFound: boolean = false;

  checked: boolean = false;
  inspectoresConNombreCompleto!: any;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private solicitudesService: SolicitudesService,
    private clientesService: ClientesService,
    private municipiosService: MunicipiosService,
    private lugaresService: LugaresService,
    private coordenadasService: CoordenadasService,
    private inspectoresService: InspectoresService,
    private ampliacionesService: AmpliacionesService,
    private instalacionesService: InstalacionesService,
    private reclamosService: ReclamosService,
    private mapaSolicitudService: MapaSolicitudService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'n', header: 'N°' },
      { field: 'clientes.personas.nombre', header: 'Cliente' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'tipo_s', header: 'Tipo' },
      { field: 'estado_s', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.tipo_solicitud = [
      { tipo_s: 'A', nombre: 'Ampliaciones' },
      { tipo_s: 'I', nombre: 'Instalaciones' },
      { tipo_s: 'R', nombre: 'Reclamos' },
    ];

    this.listar();
    this.listarClientes();
    this.listarMunicipios();
    this.listarInspectores();

    this.registerFormAdd();
    this.registerFormMod();
    this.registerFormInsp();
  }

  listar(): void {
    this.solicitudesService.listar().subscribe((res) => {
      console.log(res);

      this.solicitudes = res;
    });
  }

  listarClientes() {
    this.clientesService.listar().subscribe((res) => {
      this.clientes = res;
    });
  }

  listarMunicipios() {
    this.municipiosService.listar().subscribe((res) => {
      this.municipios = res;
    });
  }

  listarLugar(id_mu: number) {
    this.lugaresService.listarPorMunicipio(id_mu).subscribe((res) => {
      console.log(res);

      this.lugares = res;
    });
  }

  listarInspectores() {
    this.inspectoresService.listar().subscribe((res) => {
      console.log(res);
      this.inspectores = res;

      // Crear un nuevo array con el nombre completo de cada inspector
      this.inspectoresConNombreCompleto = this.inspectores.map((inspector) => {
        const personas = inspector.empleados.personas;
        const nombreCompleto = `${personas.nombre} ${personas.ap} ${
          personas.am || ''
        }`;
        return { ...inspector, nombreCompleto };
      });
    });
  }

  mostrarMapa() {
    this.mapaSolicitudService.buildMap().then((data) => {
      if (this.modalAdd) {
        this.mapaSolicitudService.puntero();
      }

      if (this.modalMod) {
        this.mapaSolicitudService.modificar(this.solicitud);
      }

      this.mapaSolicitudService.coords.subscribe((res) => {
        this.coordenada.latitud = res.latitud;
        this.coordenada.longitud = res.longitud;
      });
    });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      id_s: [''],
      tipo_s: ['', Validators.required],
      estado_s: [''],
      id_mu: ['', Validators.required],

      id_coor: [''],
      cliente: ['', [Validators.required]],
      id_emp: [''],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      id_s: [''],
      tipo_s: ['', Validators.required],
      estado_s: [''],
      id_mu: ['', Validators.required],

      id_coor: [''],
      cliente: ['', [Validators.required]],
      id_emp: [''],
    });
  }

  registerFormInsp() {
    this.Insp = this.formBuilder.group({
      id_insp: ['', Validators.required],
      id_s: [''],
    });
  }

  adicionar() {
    this.submittedAdd = true;
    const usuario = this.cookieService.getCookie('usuario')
      ? JSON.parse(this.cookieService.getCookie('usuario'))
      : null;
    this.empleado = usuario.empleados;

    if (this.Add.valid) {
      this.coordenadasService.adicionar(this.coordenada).subscribe((res) => {
        this.solicitud.tipo_s = this.Add.get('tipo_s')?.value;
        this.solicitud.id_cli = this.Add.get('cliente')?.value.id_cli;
        this.solicitud.id_emp = this.empleado.id_emp;
        this.solicitud.id_coor = res;

        console.log(this.solicitud);

        this.solicitudesService.adicionar(this.solicitud).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exitoso',
            detail: 'Solicitud adicionada',
            life: 5000,
          });
          this.modalAdd = false;
          this.listar();
        });
      });

      // this.solicitudesService.adicionar(this.solicitud).subscribe((res) => {
      // if (this.Add.get('tipo_s')?.value === 'A') {
      //   this.ampliacion.id_s = res;

      //   this.ampliacionesService
      //     .adicionar(this.ampliacion)
      //     .subscribe((res) => {
      //       this.messageService.add({
      //         severity: 'success',
      //         summary: 'Exitoso',
      //         detail: 'Solicitud adicionada',
      //         life: 5000,
      //       });
      //     });
      // } else if (this.Add.get('tipo_s')?.value === 'I') {
      //   this.instalcion.id_s = res;
      //   this.instalacionesService
      //     .adicionar(this.instalcion)
      //     .subscribe((res) => {
      //       this.messageService.add({
      //         severity: 'success',
      //         summary: 'Exitoso',
      //         detail: 'Solicitud adicionada',
      //         life: 5000,
      //       });
      //     });
      // } else if (this.Add.get('tipo_s')?.value === 'R') {
      //   this.reclamo.id_s = res;
      //   this.reclamosService.adicionar(this.reclamo).subscribe((res) => {
      //     this.messageService.add({
      //       severity: 'success',
      //       summary: 'Exitoso',
      //       detail: 'Solicitud adicionada',
      //       life: 5000,
      //     });
      //   });
      // }
      // this.messageService.add({
      //   severity: 'success',
      //   summary: 'Exitoso',
      //   detail: 'Solicitud adicionada',
      //   life: 5000,
      // });
      // this.modalAdd = false;
      // this.listar();
      // });
    } else {
      this.Add.markAllAsTouched();
    }
  }

  modificar() {
    this.submittedMod = true;

    if (this.Mod.valid) {
      this.solicitud.id_s = this.id_s;
      this.solicitud.fecha = this.Mod.get('fecha')?.value;
      this.solicitud.hora = this.Mod.get('hora')?.value;
      this.solicitud.tipo_s = this.Mod.get('tipo_s')?.value;
      this.solicitud.estado_s = this.Mod.get('estado_s')?.value;
      this.solicitud.id_coor = this.Mod.get('id_coor')?.value;
      this.solicitud.id_cli = this.Mod.get('id_cli')?.value;
      this.solicitud.id_emp = this.Mod.get('id_emp')?.value;

      this.solicitudesService.modificar(this.solicitud).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Solicitud modificada',
          life: 5000,
        });
        this.modalMod = false;
        this.listar();
      });
    } else {
      this.Mod.markAllAsTouched();
    }
  }

  aceptar() {
    this.submittedInsp = true;

    if (this.Insp.valid) {
      this.solicitudesService.aceptar(this.id_s).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Solicitud aceptada',
          life: 5000,
        });
        this.modalAcc = false;
        this.modalMod = false;
        this.listar();
      });
    } else {
      this.Insp.markAllAsTouched();
    }
  }

  rechazar() {
    this.solicitudesService.rechazar(this.id_s).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Solicitud rechazada',
        life: 5000,
      });
      this.modalDec = false;
      this.modalMod = false;
      this.listar();
    });
  }

  modalAdicionar() {
    this.modalAdd = true;
    this.Add.reset();
    this.submittedAdd = false;
    // this.listarLugar();
  }

  solicitudSeleccionada: any;

  modalModificar(solicitud: Solicitudes) {
    this.solicitudSeleccionada = solicitud;
    this.solicitud = solicitud;

    this.id_s = solicitud.id_s;
    this.modalMod = true;

    this.Mod.patchValue({
      fecha: solicitud.fecha,
      hora: solicitud.hora,
      tipo_s: solicitud.tipo_s,
      estado_s: solicitud.estado_s,
      id_coor: solicitud.id_coor,
      id_cli: solicitud.id_cli,
      id_emp: solicitud.id_emp,
    });
    this.submittedMod = false;
  }

  modalInspeccionar(solicitud: Solicitudes) {
    this.modalInsp = true;
  }

  modalAceptar() {
    this.submittedInsp = true;

    if (this.Insp.valid) {
      this.id_s = this.solicitudSeleccionada.id_s;
      this.itemSelected = `${this.solicitudSeleccionada.clientes.personas.nombre} ${this.solicitudSeleccionada.clientes.personas.ap} ${this.solicitudSeleccionada.clientes.personas.am}`;
      this.modalAcc = true;
    } else {
      this.Insp.markAllAsTouched();
    }
  }

  modalRechazar() {
    this.id_s = this.solicitudSeleccionada.id_s;
    this.itemSelected = `${this.solicitudSeleccionada.clientes.personas.nombre} ${this.solicitudSeleccionada.clientes.personas.ap} ${this.solicitudSeleccionada.clientes.personas.am}`;
    this.modalDec = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  transformRequestType(requestType: string): {
    translation: string;
    icon: string;
  } {
    switch (requestType) {
      case 'A':
        return { translation: 'Ampliaciones', icon: 'pi pi-plus' };
      case 'I':
        return { translation: 'Instalaciones', icon: 'pi pi-desktop' };
      case 'R':
        return { translation: 'Reclamos', icon: 'pi pi-user-minus' };
      default:
        return { translation: requestType, icon: '' };
    }
  }

  transformStatus(status: string): { translation: string; color: string } {
    switch (status) {
      case 'E':
        return { translation: 'En espera', color: 'info' };
      case 'A':
        return { translation: 'Aprobado', color: 'success' };
      case 'R':
        return { translation: 'Rechazado', color: 'danger' };
      default:
        return { translation: status, color: '' };
    }
  }

  buscarClientes(event: any) {
    const query = event.query.toLowerCase();

    // Filtra los clientes que coincidan con el CI o el nombre
    this.filteredClientes = this.clientes.filter((cliente) => {
      const ci = cliente.personas.ci.toLowerCase();
      const fullName = `${cliente.personas.nombre} ${cliente.personas.ap} ${
        cliente.personas.am || ''
      }`.toLowerCase();

      return ci.includes(query) || fullName.includes(query);
    });

    // Mapea los resultados para mostrar el nombre completo en el campo
    this.filteredClientes = this.filteredClientes.map((cliente) => ({
      ...cliente,
      fullname: `${cliente.personas.nombre} ${cliente.personas.ap} ${
        cliente.personas.am || ''
      }`,
    }));
  }

  // search(event: any) {
  //   const query = event.query.toLowerCase();
  //   this.clientesService.listar().subscribe((res: Clientes[]) => {
  //     this.clientes = res
  //       .map((cliente: Clientes) => ({
  //         ...cliente,
  //         fullName: `${cliente.personas.nombre} ${cliente.personas.ap} ${
  //           cliente.personas.am || ''
  //         }`,
  //       }))
  //       .filter((cliente: Clientes) => {
  //         const { nombre, ap, am } = cliente.personas;
  //         // const ci = cliente.ci || '';
  //         const fullName = `${nombre} ${ap} ${am || ''}`.toLowerCase();
  //         return (
  //           nombre.toLowerCase().includes(query) ||
  //           ap.toLowerCase().includes(query) ||
  //           am?.toLowerCase().includes(query) ||
  //           // ci.toString().toLowerCase().includes(query) ||
  //           fullName.includes(query)
  //         );
  //       });

  //     this.notFound = this.clientes.length === 0;
  //     // if (this.submittedAdd && this.notFound) {
  //     //   this.submittedAdd = false;
  //     // }
  //   });
  // }

  clienteSeleccionadoValidator(control: AbstractControl) {
    const clienteSeleccionado = control.value;
    if (!clienteSeleccionado) {
      return {
        clienteNoSeleccionado: true,
      };
    }
    return null;
  }

  buscarLugar(event: any) {
    const query = event.query.toLowerCase();

    this.filteredLugares = this.lugares.filter((lugar) => {
      const nombreLugar = lugar.nombre.toLowerCase();
      return nombreLugar.includes(query);
    });
  }

  seleccionarLugar(id_lug: number): void {
    const lugarSeleccionado = this.lugares.find(
      (lugar) => lugar.id_lug === id_lug
    );

    if (lugarSeleccionado) {
      this.mapaSolicitudService.mostrarLugar(lugarSeleccionado);
    }
  }

  seleccionarMunicipio(id_mu: number): void {
    this.listarLugar(id_mu);
  }

  cambiarCapa() {
    this.checked = !this.checked;

    if (this.checked) {
      this.mapaSolicitudService.cambiarEstilo(
        'mapbox://styles/mapbox/satellite-v9'
      );
    } else {
      this.mapaSolicitudService.cambiarEstilo(
        'mapbox://styles/sunshine772/cl979ypfr001414m9bcpwclzn'
      );
    }
  }
}
