import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Fases } from 'src/app/api/models/fases/fases';
import { FasesService } from 'src/app/api/services/fases/fases.service';

@Component({
  selector: 'app-fases',
  templateUrl: './fases.component.html',
  styleUrls: ['./fases.component.scss'],
  providers: [MessageService],
})
export class FasesComponent {
  fase = new Fases();
  fases: Fases[] = [];

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
  id_fa: number = 0;

  cols: any[] = [];

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private fasesService: FasesService
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
    this.fasesService.listar().subscribe((res) => {
      this.fases = res;
    });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      id_fa: [''],
      nombre: ['', Validators.required],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      id_fa: [''],
      nombre: ['', Validators.required],
    });
  }

  adicionar() {
    this.submittedAdd = true;

    if (this.Add.valid) {
      this.fase.nombre = this.Add.get('nombre')?.value.toUpperCase();

      this.fasesService.adicionar(this.fase).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Fase adicionada',
          life: 3000,
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
      this.fase.id_fa = this.id_fa;
      this.fase.nombre = this.Mod.get('nombre')?.value.toUpperCase();

      this.fasesService.modificar(this.fase).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Fase modificada',
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
    this.fasesService.habilitar(this.id_fa).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Fase habilitada',
        life: 3000,
      });
      this.modalEnable = false;
      this.listar();
    });
  }

  deshabilitar() {
    this.fasesService.deshabilitar(this.id_fa).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Fase deshabilitada',
        life: 3000,
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

  modalModificar(fase: Fases) {
    this.id_fa = fase.id_fa;
    this.modalMod = true;
    this.Mod.patchValue({
      nombre: fase.nombre,
    });
    this.submittedMod = false;
  }

  modalHabilitar(fase: Fases) {
    this.id_fa = fase.id_fa;
    this.itemSelected = fase.nombre;
    this.modalEnable = true;
  }

  modalDeshabilitar(fase: Fases) {
    this.id_fa = fase.id_fa;
    this.itemSelected = fase.nombre;
    this.modalDisable = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
