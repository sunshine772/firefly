import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Instalaciones } from 'src/app/api/models/instalaciones/instalaciones';
import { Clientes } from 'src/app/api/models/clientes/clientes';
import { Fases } from 'src/app/api/models/fases/fases';
import { ClientesService } from 'src/app/api/services/clientes/clientes.service';
import { FasesService } from 'src/app/api/services/fases/fases.service';
import { InstalacionesService } from 'src/app/api/services/instalaciones/instalaciones.service';

@Component({
  selector: 'app-instalaciones',
  templateUrl: './instalaciones.component.html',
  styleUrls: ['./instalaciones.component.scss'],
  providers: [MessageService, DialogService],
})
export class InstalacionesComponent {
  instalaciones: Instalaciones[] = [];
  fases: Fases[] = [];
  fasesModel: any[] = [];

  cliente: any;
  filteredClientes: any[] = [];
  activeIndex: number = 0;

  Add!: FormGroup;
  submittedAdd = false;
  Mod!: FormGroup;
  submittedMod = false;
  Enable!: FormGroup;
  submittedEnable = false;
  Disable!: FormGroup;
  submittedDisable = false;
  Update!: FormGroup;
  submittedUpdate = false;

  datosTabla = [
    { id: 1, nombre: 'Ejemplo 1', descripcion: 'Descripción 1' },
    { id: 2, nombre: 'Ejemplo 2', descripcion: 'Descripción 2' },
    { id: 3, nombre: 'Ejemplo 3', descripcion: 'Descripción 3' },
  ];

  modalAdd: boolean = false;
  modalMod: boolean = false;
  modalDisable: boolean = false;
  modalEnable: boolean = false;
  modalUpdate: boolean = false;

  cols: any[] = [];

  documentos: (File | null)[] = [];

  constructor(
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private instalacionesService: InstalacionesService,
    private clientesService: ClientesService,
    private fasesService: FasesService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'n', header: 'N°' },
      { field: 'nombre', header: 'Solicitud' },
      { field: 'nombre', header: 'Lugar' },
      { field: 'nombre', header: 'Cliente' },
      { field: 'nombre', header: 'Inspector' },
      { field: 'estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.listar();

    this.registerFormAdd();
    this.registerFormMod();
  }

  listar(): void {
    this.instalacionesService.listar().subscribe((res) => {
      console.log(res);

      this.instalaciones = res;
    });
  }

  listarFases(): void {
    this.fasesService.listar().subscribe((res) => {
      console.log(res);

      const fasesTransformadas = res.map((fase) => ({
        label: fase.nombre,
      }));

      this.fasesModel = fasesTransformadas;
    });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      ci: ['', Validators.required],
      nombre: ['', Validators.required],
    });
  }
  registerFormMod() {
    this.Mod = this.formBuilder.group({
      ci: ['', Validators.required],
      nombre: ['', Validators.required],
    });
  }

  adicionar() {
    this.submittedAdd = true;

    if (this.Add.valid) {
      console.log('Datos guardados:', this.Add.value);
      this.modalAdd = false;
    } else {
      this.Add.markAllAsTouched();
    }
  }

  modificar() {
    this.submittedMod = true;

    if (this.Mod.valid) {
      console.log('Datos guardados:', this.Mod.value);
      this.modalMod = false;
    } else {
      this.Mod.markAllAsTouched();
    }
  }

  habilitar() {
    this.modalEnable = false;
  }

  deshabilitar() {
    this.modalDisable = false;
  }
  actualizar() {
    this.modalDisable = false;
  }

  modalAdicionar() {
    this.modalAdd = true;
    this.Add.reset();
    this.submittedAdd = false;
  }
  modalModificar(instalacion: Instalaciones) {
    this.modalMod = true;
    this.Mod.reset();
    this.submittedMod = false;
  }
  modalHabilitar(instalacion: Instalaciones) {
    this.modalEnable = true;
  }
  modalDeshabilitar(instalacion: Instalaciones) {
    this.modalDisable = true;
  }
  modalActualizar() {
    this.modalUpdate = true;
    this.listarFases();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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

  searchClientes(event: any) {
    this.clientesService
      .buscar(event.query)
      .subscribe((clientes: Clientes[]) => {
        this.filteredClientes = clientes.map((cliente) => {
          const nombreCompleto = `${cliente.personas.nombre} ${cliente.personas.ap} ${cliente.personas.am}`;
          return { ...cliente, nombreCompleto };
        });
      });
  }

  selectCliente(event: any) {
    this.Add.controls['ci'].setValue(event.ci);
  }

  showPreviousButton = false;
  showNextButton = true;
  showFinishButton = false;

  previousStep(): void {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      this.updateButtonVisibility();
    }
  }

  nextStep(): void {
    if (this.activeIndex < this.fasesModel.length - 1) {
      this.activeIndex++;
      this.updateButtonVisibility();
    } else {
      this.modalUpdate = false; // Establecer modalUpdate en true para mostrar el modal
    }
  }

  updateButtonVisibility(): void {
    this.showPreviousButton = this.activeIndex > 0;
    this.showNextButton = this.activeIndex < this.fasesModel.length - 1;
    this.showFinishButton = this.activeIndex === this.fasesModel.length - 1;

    if (this.showFinishButton) {
    }
  }

  onFileSelected(event: any, i: number) {
    const file: File = event.target.files[0];
    if (this.documentos[i]) {
      // Si ya hay un archivo seleccionado en la posición i, conservarlo
      return;
    }
    this.documentos[i] = file;
  }

  hasDocument(index: number): boolean {
    return !!this.documentos[index];
  }

  getDocumentUrl(index: number): string | null {
    const documento = this.documentos[index];
    return documento ? URL.createObjectURL(documento) : null;
  }
}
