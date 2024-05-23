import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Areas } from 'src/app/api/models/areas/areas';
import { AreasService } from 'src/app/api/services/areas/areas.service';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss'],
  providers: [MessageService],
})
export class AreasComponent {
  area = new Areas();
  areas: Areas[] = [];

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
  modalDisable: boolean = false;
  modalEnable: boolean = false;

  itemSelected: string = '';
  id_a: number = 0;

  cols: any[] = [];

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private areasService: AreasService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'n', header: 'N°' },
      { field: 'nombre', header: 'Nombre' },
      // { field: 'descripcion', header: 'Descripción' },
      { field: 'estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.listar();

    this.registerFormAdd();
    this.registerFormMod();
  }

  listar(): void {
    this.areasService.listar().subscribe((res) => {
      this.areas = res;
    });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      id_a: [''],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      descripcion: ['', [Validators.minLength(3), Validators.maxLength(500)]],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      id_a: [''],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      descripcion: ['', [Validators.minLength(3), Validators.maxLength(500)]],
    });
  }

  // validationMessages = {
  //   nombre: [
  //     { type: 'required', message: 'El nombre es requerido.' },
  //     {
  //       type: 'minlength',
  //       message: 'El nombre debe tener al menos 3 caracteres.',
  //     },
  //     {
  //       type: 'maxlength',
  //       message: 'El nombre no debe tener más de 50 caracteres.',
  //     },
  //   ],
  //   descripcion: [
  //     {
  //       type: 'maxlength',
  //       message: 'La descripción no debe tener más de 100 caracteres.',
  //     },
  //   ],
  // };

  adicionar() {
    this.submittedAdd = true;

    if (this.Add.valid) {
      this.area.nombre = this.Add.get('nombre')?.value.toUpperCase();
      this.area.descripcion = this.Add.get('descripcion')?.value
        ? this.Add.get('descripcion')?.value.toUpperCase()
        : null;

      this.areasService.adicionar(this.area).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Área adicionada',
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
      this.area.id_a = this.id_a;
      this.area.nombre = this.Mod.get('nombre')?.value.toUpperCase();
      this.area.descripcion = this.Mod.get('descripcion')?.value
        ? this.Mod.get('descripcion')?.value.toUpperCase()
        : null;

      this.areasService.modificar(this.area).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Área modificada',
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
    this.areasService.habilitar(this.id_a).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Área habilitada',
        life: 5000,
      });
      this.modalEnable = false;
      this.listar();
    });
  }

  deshabilitar() {
    this.areasService.deshabilitar(this.id_a).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Área deshabilitada',
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

  modalModificar(area: Areas) {
    this.id_a = area.id_a;
    this.modalMod = true;
    this.Mod.patchValue({
      nombre: area.nombre,
      descripcion: area.descripcion,
    });
    this.submittedMod = false;
  }

  modalHabilitar(area: Areas) {
    this.id_a = area.id_a;
    this.itemSelected = area.nombre;
    this.modalEnable = true;
  }

  modalDeshabilitar(area: Areas) {
    this.id_a = area.id_a;
    this.itemSelected = area.nombre;
    this.modalDisable = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
