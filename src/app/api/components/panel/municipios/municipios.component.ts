import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Municipios } from 'src/app/api/models/municipios/municipios';
import { MunicipiosService } from 'src/app/api/services/municipios/municipios.service';

@Component({
  selector: 'app-municipios',
  templateUrl: './municipios.component.html',
  styleUrls: ['./municipios.component.scss'],
  providers: [MessageService],
})
export class MunicipiosComponent {
  municipio = {} as Municipios;
  municipios: Municipios[] = [];

  Add!: FormGroup;
  submittedAdd = false;
  Mod!: FormGroup;
  submittedMod = false;
  Enable!: FormGroup;
  submittedEnable = false;
  Disable!: FormGroup;
  submittedDisable = false;

  modalAdd = false;
  modalMod = false;
  modalDisable = false;
  modalEnable = false;

  itemSelected = '';
  id_mu = 0;

  cols: any[] = [];

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private municipiosService: MunicipiosService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'n', header: 'N°' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.listar();

    this.registerFormAdd();
    this.registerFormMod();
  }

  listar(): void {
    this.municipiosService.listar().subscribe((res) => {
      this.municipios = res;
    });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      id_mu: [''],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      id_mu: [''],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  adicionar() {
    this.submittedAdd = true;

    if (this.Add.valid) {
      this.municipio.nombre = this.Add.get('nombre')?.value.toUpperCase();
      this.municipio.estado = this.Add.get('estado')?.value;

      this.municipiosService.adicionar(this.municipio).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Municipio adicionado',
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
      this.municipio.id_mu = this.id_mu;
      this.municipio.nombre = this.Mod.get('nombre')?.value.toUpperCase();
      this.municipio.estado = this.Mod.get('estado')?.value;

      this.municipiosService.modificar(this.municipio).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Municipio modificado',
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
    this.municipiosService.habilitar(this.id_mu).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Municipio habilitado',
        life: 5000,
      });
      this.modalEnable = false;
      this.listar();
    });
  }

  deshabilitar() {
    this.municipiosService.deshabilitar(this.id_mu).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Municipio deshabilitado',
        life: 5000,
      });
      this.modalDisable = false;
      this.listar();
    });
  }

  modalAdicionar() {
    this.modalAdd = true;
    this.Add.reset();
    this.submittedAdd = false;
  }

  modalModificar(municipio: Municipios) {
    this.id_mu = municipio.id_mu;
    this.modalMod = true;
    this.Mod.patchValue({
      nombre: municipio.nombre,
    });
    this.submittedMod = false;
  }

  modalHabilitar(municipio: Municipios) {
    this.id_mu = municipio.id_mu;
    this.itemSelected = municipio.nombre;
    this.modalEnable = true;
  }

  modalDeshabilitar(municipio: Municipios) {
    this.id_mu = municipio.id_mu;
    this.itemSelected = municipio.nombre;
    this.modalDisable = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
