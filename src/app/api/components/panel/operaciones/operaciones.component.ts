import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Actividades } from 'src/app/api/models/actividades/actividades';
import { Empleados } from 'src/app/api/models/empleados/empleados';
import { Lugares } from 'src/app/api/models/lugares/lugares';
import { Operaciones } from 'src/app/api/models/operaciones/operaciones';
import { ActividadesService } from 'src/app/api/services/actividades/actividades.service';
import { CookieService } from 'src/app/api/services/cookie/cookie.service';
import { EmpleadosService } from 'src/app/api/services/empleados/empleados.service';
import { LugaresService } from 'src/app/api/services/lugares/lugares.service';
import { OperacionesService } from 'src/app/api/services/operaciones/operaciones.service';

@Component({
  selector: 'app-operaciones',
  templateUrl: './operaciones.component.html',
  styleUrls: ['./operaciones.component.scss'],
  providers: [MessageService],
})
export class OperacionesComponent {
  private operacion = new Operaciones();
  private actividad = new Actividades();
  operaciones: Operaciones[] = [];
  lugares: Lugares[] = [];
  actividades: Actividades[] = [];
  empleados: Empleados[] = [];
  filteredEmpleados: Empleados[] = [];

  Add!: FormGroup;
  submittedAdd = false;
  Mod!: FormGroup;
  submittedMod = false;
  Disable!: FormGroup;
  submittedDisable = false;
  AddA!: FormGroup;
  submittedAddA = false;
  ModA!: FormGroup;
  submittedModA = false;

  modalAdd: boolean = false;
  modalMod: boolean = false;
  modalDisable: boolean = false;
  modalEnable: boolean = false;
  modalAddA: boolean = false;
  modalModA: boolean = false;
  modalDisableA: boolean = false;
  modalEnableA: boolean = false;

  itemSelected: string = '';
  id_op: number = 0;
  id_act: number = 0;

  cols: any[] = [];
  colsActividades: any[] = [];

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private operacionesService: OperacionesService,
    private lugaresServices: LugaresService,
    private actividadesService: ActividadesService,
    private empleadosService: EmpleadosService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'n', header: '' },
      { field: 'n', header: 'N°' },
      { field: 'objetivo', header: 'Objetivo' },
      { field: 'fecha', header: 'Fecha de operación' },
      { field: 'lugares.nombre', header: 'Lugar' },
      { field: 'estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.colsActividades = [
      { field: 'n', header: 'N°' },
      { field: 'actividades.empleados.personas.nombre', header: 'Empleado' },
      { field: 'actividades.labor', header: 'Labor' },
      { field: 'actividades.hprog', header: 'Hora programada' },
      { field: 'actividades.estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.listar();
    this.listarLugares();
    this.listarEmpleados();
    this.registerFormAdd();
    this.registerFormMod();
    this.registerFormAddA();
    this.registerFormModA();
  }

  listar(): void {
    this.operacionesService.listar().subscribe((res) => {
      this.operaciones = res;
      console.log(res);
      
    });
  }

  listarLugares() {
    this.lugaresServices.listar().subscribe((res) => {
      this.lugares = res;
    });
  }

  listarEmpleados() {
    this.empleadosService.listar().subscribe((res) => {
      this.empleados = res;
    });
  }

  listarActividades(id_op: number) {
    this.id_op = id_op;
    this.actividadesService
      .listarActividadesOperaciones(this.id_op)
      .subscribe((res) => {
        this.actividades = res;
        console.log(res);
      });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      id_op: [''],
      objetivo: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      descripcion: ['', [Validators.minLength(3), Validators.maxLength(500)]],
      desde: ['', [Validators.required]],
      hasta: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      id_lug: ['', [Validators.required]],
      id_emp: [''],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      id_op: [''],
      objetivo: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      descripcion: ['', [Validators.minLength(3), Validators.maxLength(500)]],
      desde: ['', [Validators.required]],
      hasta: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      id_lug: ['', [Validators.required]],
      id_emp: [''],
    });
  }

  registerFormAddA() {
    this.AddA = this.formBuilder.group({
      id_act: [''],
      labor: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      hprog: ['', [Validators.required]],
      id_op: [''],
      empleado: ['', Validators.required],
    });
  }

  registerFormModA() {
    this.ModA = this.formBuilder.group({
      id_act: [''],
      labor: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      hprog: ['', [Validators.required]],
      id_op: [''],
      empleado: ['', Validators.required],
    });
  }

  adicionar() {
    this.submittedAdd = true;
    const usuario = this.cookieService.getCookie('usuario')
      ? JSON.parse(this.cookieService.getCookie('usuario'))
      : null;

    if (this.Add.valid) {
      this.operacion.objetivo = this.Add.get('objetivo')?.value.toUpperCase();
      this.operacion.descripcion = this.Add.get('descripcion')?.value
        ? this.Add.get('descripcion')?.value.toUpperCase()
        : null;
      this.operacion.desde = this.dateToTime(this.Add.get('desde')?.value);
      this.operacion.hasta = this.dateToTime(this.Add.get('hasta')?.value);
      this.operacion.fecha = this.Add.get('fecha')?.value;
      this.operacion.id_lug = this.Add.get('id_lug')?.value;
      this.operacion.id_emp = 1;

      console.log(this.operacion);

      this.operacionesService.adicionar(this.operacion).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Operación adicionada',
          life: 5000,
        });
        this.modalAdd = false;
        this.listar();
      });
    } else {
      this.Add.markAllAsTouched();
    }
  }

  modificar() {
    this.submittedMod = true;

    if (this.Mod.valid) {
      this.operacion.id_op = this.Mod.get('id_op')?.value;
      this.operacion.objetivo = this.Mod.get('objetivo')?.value.toUpperCase();
      this.operacion.descripcion = this.Mod.get('descripcion')?.value
        ? this.Mod.get('descripcion')?.value.toUpperCase()
        : null;
      this.operacion.desde = this.dateToTime(this.Mod.get('desde')?.value);
      this.operacion.hasta = this.dateToTime(this.Mod.get('hasta')?.value);
      this.operacion.fecha = this.Mod.get('fecha')?.value;
      this.operacion.id_lug = this.Mod.get('id_lug')?.value;
      this.operacion.id_emp = 1;

      console.log(this.operacion);

      this.operacionesService.modificar(this.operacion).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Operación modificada',
          life: 5000,
        });
        this.modalMod = false;
        this.listar();
      });
    } else {
      this.Mod.markAllAsTouched();
    }
  }

  habilitar() {
    this.operacionesService.habilitar(this.id_op).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Operación habilitada',
        life: 5000,
      });
      this.modalEnable = false;
      this.listar();
    });
  }

  deshabilitar() {
    this.operacionesService.deshabilitar(this.id_op).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Operación deshabilitada',
        life: 5000,
      });
      this.modalDisable = false;
      this.listar();
    });
  }

  adicionarActividad() {
    this.submittedAddA = true;

    if (this.AddA.valid) {
      this.actividad.labor = this.AddA.get('labor')?.value.toUpperCase();
      this.actividad.hprog = this.dateToTime(this.AddA.get('hprog')?.value);
      this.actividad.id_op = this.id_op;
      this.actividad.id_emp = this.AddA.get('empleado')?.value.id_emp;

      this.actividadesService.adicionar(this.actividad).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Actividad adicionada',
          life: 5000,
        });
        this.modalAddA = false;
        this.listarActividades(this.id_op);
      });
    } else {
      this.AddA.markAllAsTouched();
    }
  }

  modificarActividad() {
    this.submittedModA = true;

    if (this.ModA.valid) {
      this.actividad.id_act = this.ModA.get('id_act')?.value;
      this.actividad.labor = this.ModA.get('labor')?.value.toUpperCase();
      this.actividad.hprog = this.dateToTime(this.ModA.get('hprog')?.value);
      this.actividad.id_op = this.ModA.get('id_op')?.value;
      this.actividad.id_emp = this.ModA.get('empleado')?.value.id_emp;

      this.actividadesService.modificar(this.actividad).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Actividad modificada',
          life: 5000,
        });
        this.modalModA = false;
        this.listarActividades(this.id_op);
      });
    } else {
      this.ModA.markAllAsTouched();
    }
  }

  habilitarActividad() {
    this.actividadesService.habilitar(this.id_act).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Actividad habilitada',
        life: 5000,
      });
      this.modalEnableA = false;
      this.listarActividades(this.id_op);
    });
  }

  deshabilitarActividad() {
    this.actividadesService.deshabilitar(this.id_act).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Actividad habilitada',
        life: 5000,
      });
      this.modalDisableA = false;
      this.listarActividades(this.id_op);
    });
  }

  modalAdicionar() {
    this.modalAdd = true;
    this.Add.reset();
    this.submittedAdd = false;
  }

  modalModificar(operacion: Operaciones) {
    this.id_op = operacion.id_op;
    this.modalMod = true;
    this.Mod.patchValue({
      id_op: operacion.id_op,
      objetivo: operacion.objetivo,
      descripcion: operacion.descripcion,
      desde: this.timeToDate(operacion.desde),
      hasta: this.timeToDate(operacion.hasta),
      fecha: this.stringToDate(operacion.fecha),
      id_lug: operacion.lugares.id_lug,
      id_emp: operacion.id_emp,
    });
    this.submittedMod = false;
  }

  modalHabilitar(operacion: Operaciones) {
    this.id_op = operacion.id_op;
    this.itemSelected = operacion.objetivo;
    this.modalEnable = true;
  }

  modalDeshabilitar(operacion: Operaciones) {
    this.id_op = operacion.id_op;
    this.itemSelected = operacion.objetivo;
    this.modalDisable = true;
  }

  modalAsignarActividad(operacion: Operaciones) {
    this.id_op = operacion.id_op;
    this.modalAddA = true;
    this.AddA.reset();
    this.submittedAddA = false;
  }

  modalModificarActividad(actividad: Actividades) {
    this.modalModA = true;
    this.ModA.patchValue({
      id_act: actividad.id_act,
      labor: actividad.labor,
      hprog: this.timeToDate(actividad.hprog),
      id_op: actividad.id_op,
      empleado: actividad.empleados,
    });
    this.submittedModA = false;
  }

  modalHabilitarActividad(actividad: Actividades) {
    this.id_act = actividad.id_act;
    this.modalEnableA = true;
  }

  modalDeshabilitarActividad(actividad: Actividades) {
    this.id_act = actividad.id_act;
    this.modalDisableA = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  dateToTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  timeToDate(timeString: string): Date {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    return date;
  }

  buscarEmpleados(event: any) {
    const query = event.query.toLowerCase();

    // Filtra los empleados que coincidan con el CI o el nombre
    this.filteredEmpleados = this.empleados.filter((empleado) => {
      const ci = empleado.personas.ci.toLowerCase();
      const fullName = `${empleado.personas.nombre} ${empleado.personas.ap} ${
        empleado.personas.am || ''
      }`.toLowerCase();

      return ci.includes(query) || fullName.includes(query);
    });

    // Mapea los resultados para mostrar el nombre completo en el campo
    this.filteredEmpleados = this.filteredEmpleados.map((empleado) => ({
      ...empleado,
      fullname: `${empleado.personas.nombre} ${empleado.personas.ap} ${
        empleado.personas.am || ''
      }`,
    }));
  }

  stringToDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
}
