import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, TreeNode } from 'primeng/api';
import { TreeTable } from 'primeng/treetable';
import { Empleados } from 'src/app/api/models/empleados/empleados';
import { Responsables } from 'src/app/api/models/responsables/responsables';
import { Subordinados } from 'src/app/api/models/subordinados/subordinados';
import { EmpleadosService } from 'src/app/api/services/empleados/empleados.service';
import { ResponsablesService } from 'src/app/api/services/responsables/responsables.service';

@Component({
  selector: 'app-subordinados',
  templateUrl: './subordinados.component.html',
  styleUrls: ['./subordinados.component.scss'],
  providers: [MessageService],
})
export class SubordinadosComponent {
  responsable = new Responsables();
  responsables: TreeNode[] = [];
  empleados: Empleados[] = [];

  Add!: FormGroup;
  submittedAdd = false;
  Mod!: FormGroup;
  submittedMod = false;
  Enable!: FormGroup;
  submittedEnable = false;
  Disable!: FormGroup;
  submittedDisable = false;

  modalAdd: boolean = false;
  modalMod: boolean = false;
  modalEnable: boolean = false;
  modalDisable: boolean = false;
  modalAsi: boolean = false;
  modalEli: boolean = false;

  itemSelected: string = '';
  nombreCompleto: string = '';

  id_res: number = 0;

  cols: any[] = [];

  imageUrl!: string;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private responsablesService: ResponsablesService,
    private empleadosService: EmpleadosService
  ) {}

  ngOnInit() {
    this.cols = [
      // { field: 'foto', header: 'Foto' },
      { field: 'empleados.personas.nombre', header: 'Responsable' },
      { field: 'empleados.cargos.nombre', header: 'Cargo' },
      { field: 'empleados.cargos.areas.nombre', header: 'Area' },
      { field: 'estado', header: 'Estado' },
    ];

    this.listar();
    this.listarEmpleados();

    this.registerFormAdd();
    this.registerFormMod();
  }

  listar(): void {
    this.responsablesService.listar().subscribe((res) => {
      console.log(res);
      // this.responsables = res;
      this.responsables = this.responsablesToTreeNode(res);
    });
  }

  listarEmpleados() {
    this.empleadosService.listar().subscribe((res) => {
      this.empleados = res.map((empleado) => ({
        ...empleado,
        nombreCompleto: empleado.personas.am
          ? `${empleado.personas.nombre} ${empleado.personas.ap} ${empleado.personas.am}`
          : `${empleado.personas.nombre} ${empleado.personas.ap}`
      }));
    });
  }
  
  registerFormAdd() {
    this.Add = this.formBuilder.group({
      ci: ['', Validators.required],
      inicio: ['', Validators.required],
      fin: [''],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      ci: ['', Validators.required],
      inicio: ['', Validators.required],
      fin: [''],
    });
  }

  adicionar() {
    this.submittedAdd = true;

    if (this.Add.valid) {
      this.responsable.ci = this.Add.get('ci')?.value;
      this.responsable.inicio = this.DateToString(
        this.Add.get('inicio')?.value
      );
      this.responsable.fin = this.DateToString(this.Add.get('fin')?.value);
console.log(this.responsable);

      // this.responsablesService.adicionar(this.responsable).subscribe((res) => {
      //   this.messageService.add({
      //     severity: 'success',
      //     summary: 'Exitoso',
      //     detail: 'Responsable adicionado',
      //     life: 3000,
      //   });
      //   this.modalAdd = false;
      //   this.listar();
      // });
    } else {
      this.Add.markAllAsTouched();
    }
  }

  modificar() {
    this.submittedMod = true;

    if (this.Mod.valid) {
      this.responsable.id_res = this.id_res;
      this.responsable.ci = this.Mod.get('ci')?.value;

      this.responsablesService.modificar(this.responsable).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Responsable modificado',
          life: 3000,
        });
        this.modalMod = false;
        this.listar();
      });
    } else {
      this.Mod.markAllAsTouched();
    }
  }

  habilitar() {
    this.responsablesService.habilitar(this.id_res).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Responsable habilitado',
        life: 3000,
      });
      this.modalEnable = false;
      this.listar();
    });
  }

  deshabilitar() {
    this.responsablesService.deshabilitar(this.id_res).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Responsable deshabilitado',
        life: 3000,
      });
      this.modalDisable = false;
      this.listar();
    });
  }

  eliminar() {}

  modalAdicionar() {
    this.modalAdd = true;
    this.Add.reset();
    this.submittedAdd = false;
  }

  modalModificar(responsable: Responsables) {
    this.id_res = responsable.id_res;
    this.modalMod = true;
    this.Mod.patchValue({});
    this.submittedMod = false;
  }

  modalHabilitar(responsable: Responsables) {
    this.modalEnable = true;
    this.id_res = responsable.id_res;
    this.itemSelected = `${responsable.empleados.personas.nombre} ${responsable.empleados.personas.ap} ${responsable.empleados.personas.am}`;
  }

  modalDeshabilitar(responsable: Responsables) {
    this.modalDisable = true;
    this.id_res = responsable.id_res;
    this.itemSelected = `${responsable.empleados.personas.nombre} ${responsable.empleados.personas.ap} ${responsable.empleados.personas.am}`;
  }

  modalAsignar(responsable: Responsables) {
    this.modalAsi = true;
    this.id_res = responsable.id_res;
    this.itemSelected = responsable.empleados.personas.nombre;
  }

  modalEliminar(responsable: Responsables) {
    this.id_res = responsable.id_res;
    this.itemSelected = `${responsable.empleados.personas.nombre} ${responsable.empleados.personas.ap} ${responsable.empleados.personas.am}`;
    this.modalEli = true;
  }

  onGlobalFilter(table: TreeTable, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  responsablesToTreeNode(responsables: any[]): TreeNode[] {
    return responsables.map((responsable) => {
      const children = responsable.subordinados
        ? this.responsablesToTreeNode(responsable.subordinados)
        : [];

      return {
        key: responsable.id_res.toString(),
        label: responsable.empleados.personas.nombre,
        data: responsable,
        icon: '',
        children: children,
      };
    });
  }

  getImagenUrl(imagen: string): string {
    return 'data:image/png;base64,' + imagen;
  }

  getNombreCompleto(empleado: Empleados): string {
    return `${empleado.personas.nombre} ${empleado.personas.ap} ${empleado.personas.am}`;
  }
  
  // search(event: any) {
  //   const query = event.query.toLowerCase();
  //   this.empleadosService.listar().subscribe((res: Empleados[]) => {
  //     this.empleados = res
  //       .map((empleado: Empleados) => ({
  //         ...empleado,
  //         fullName: `${empleado.personas.nombre} ${empleado.personas.ap} ${
  //           empleado.personas.am || ''
  //         }`,
  //       }))
  //       .filter((empleado: Empleados) => {
  //         const { nombre, ap, am } = empleado.personas;
  //         const ci = empleado.ci || '';
  //         const fullName = `${nombre} ${ap} ${am || ''}`.toLowerCase();
  //         return (
  //           nombre.toLowerCase().includes(query) ||
  //           ap.toLowerCase().includes(query) ||
  //           am?.toLowerCase().includes(query) ||
  //           ci.toString().toLowerCase().includes(query) ||
  //           fullName.includes(query)
  //         );
  //       });
  //   });
  // }

  // seleccionarEmpleado(empleado: Empleados): void {
  //   console.log(empleado);
  // }

  DateToString(fecha: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    return fecha.toLocaleDateString('es-ES', options);
  }

  stringToDate(fecha: string) {
    const parts = fecha.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    return new Date(year, month, day);
  }
}
