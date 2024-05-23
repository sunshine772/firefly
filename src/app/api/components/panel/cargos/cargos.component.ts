import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Areas } from 'src/app/api/models/areas/areas';
import { Cargos } from 'src/app/api/models/cargos/cargos';
import { AreasService } from 'src/app/api/services/areas/areas.service';
import { CargosService } from 'src/app/api/services/cargos/cargos.service';

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.scss'],
  providers: [MessageService],
})
export class CargosComponent implements OnInit {
  cargo = new Cargos();
  cargos: Cargos[] = [];
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
  id_car: number = 0;

  cols: any[] = [];

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private cargosService: CargosService,
    private areasService: AreasService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'n', header: 'N°' },
      { field: 'nombre', header: 'Nombre' },
      // { field: 'descripcion', header: 'Descripción' },
      { field: 'areas.nombre', header: 'Area' },
      { field: 'estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.listar();
    this.listarAreas();

    this.registerFormAdd();
    this.registerFormMod();
  }

  listar(): void {
    this.cargosService.listar().subscribe((res) => {
      this.cargos = res;
    });
  }

  listarAreas() {
    this.areasService.listar().subscribe((res) => {
      this.areas = res;
    });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      id_car: [''],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      descripcion: ['', [Validators.minLength(3), Validators.maxLength(500)]],
      id_a: ['', Validators.required],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      id_car: [''],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      descripcion: ['', [Validators.minLength(3), Validators.maxLength(500)]],
      id_a: ['', Validators.required],
    });
  }

  adicionar() {
    this.submittedAdd = true;

    if (this.Add.valid) {
      this.cargo.nombre = this.Add.get('nombre')?.value.toUpperCase();
      this.cargo.descripcion = this.Add.get('descripcion')?.value
        ? this.Add.get('descripcion')?.value.toUpperCase()
        : null;
      this.cargo.id_a = this.Add.get('id_a')?.value;

      this.cargosService.adicionar(this.cargo).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Cargo adicionado',
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
      this.cargo.id_car = this.id_car;
      this.cargo.nombre = this.Mod.get('nombre')?.value.toUpperCase();
      this.cargo.descripcion = this.Mod.get('descripcion')?.value
        ? this.Mod.get('descripcion')?.value.toUpperCase()
        : null;
      this.cargo.id_a = this.Mod.get('id_a')?.value;

      console.log(this.cargo);
      
      this.cargosService.modificar(this.cargo).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Cargo modificado',
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
    this.cargosService.habilitar(this.id_car).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Cargo habilitado',
        life: 5000,
      });
      this.modalEnable = false;
      this.listar();
    });
  }

  deshabilitar() {
    this.cargosService.deshabilitar(this.id_car).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Cargo deshabilitado',
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

  modalModificar(cargo: Cargos) {
    this.id_car = cargo.id_car;
    this.modalMod = true;
    this.Mod.patchValue({
      nombre: cargo.nombre,
      descripcion: cargo.descripcion,
      id_a: cargo.areas.id_a,
    });
    this.submittedMod = false;
  }

  modalHabilitar(cargo: Cargos) {
    this.id_car = cargo.id_car;
    this.itemSelected = cargo.nombre;
    this.modalEnable = true;
  }

  modalDeshabilitar(cargo: Cargos) {
    this.id_car = cargo.id_car;
    this.itemSelected = cargo.nombre;
    this.modalDisable = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
