import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { tap, map } from 'rxjs';

import { Calles } from 'src/app/api/models/calles/calles';
import { Lugares } from 'src/app/api/models/lugares/lugares';
import { Rutas } from 'src/app/api/models/rutas/rutas';
import { CallesService } from 'src/app/api/services/calles/calles.service';
import { LugaresService } from 'src/app/api/services/lugares/lugares.service';
import { RutasService } from 'src/app/api/services/rutas/rutas.service';

@Component({
  selector: 'app-calles',
  templateUrl: './calles.component.html',
  styleUrls: ['./calles.component.scss'],
  providers: [MessageService],
})
export class CallesComponent {
  calle = new Calles();
  calles: Calles[] = [];
  lugares: Lugares[] = [];
  rutas: Rutas[] = [];

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
  id_calle: number = 0;

  cols: any[] = [];

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private callesService: CallesService,
    private lugaresService: LugaresService,
    private rutasService: RutasService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'n', header: 'N°' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'lugares.nombre', header: 'Lugar' },
      { field: 'rutas.nombre', header: 'Ruta' },
      { field: 'estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.listar();
    this.listarLugares();
    this.listarRutas();

    this.registerFormAdd();
    this.registerFormMod();
  }

  listar(): void {
    this.callesService.listar().subscribe((res) => {
      this.calles = res;
    });
  }

  listarLugares(): void {
    this.lugaresService.listar().subscribe((res) => {
      this.lugares = res;
    });
  }

  listarRutas(): void {
    this.rutasService.listar().subscribe((res) => {
      this.rutas = res;
    });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      id_calle: [''],
      nombre: ['', Validators.required],
      id_lug: ['', Validators.required],
      id_rut: ['', Validators.required],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      id_calle: [''],
      nombre: ['', Validators.required],
      id_lug: ['', Validators.required],
      id_rut: ['', Validators.required],
    });
  }

  adicionar() {
    this.submittedAdd = true;

    if (this.Add.valid) {
      this.calle.nombre = this.Add.get('nombre')?.value.toUpperCase();
      this.calle.id_lug = this.Add.get('id_lug')?.value;
      this.calle.id_rut = this.Add.get('id_rut')?.value;

      this.callesService.adicionar(this.calle).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Calle adicionada',
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
      this.calle.id_calle = this.id_calle;
      this.calle.nombre = this.Mod.get('nombre')?.value.toUpperCase();
      this.calle.id_lug = this.Mod.get('id_lug')?.value;
      this.calle.id_rut = this.Mod.get('id_rut')?.value;

      this.callesService.modificar(this.calle).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Calle modificada',
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
    this.callesService.habilitar(this.id_calle).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Calle habilitada',
        life: 3000,
      });
      this.modalEnable = false;
      this.listar();
    });
  }

  deshabilitar() {
    this.callesService.deshabilitar(this.id_calle).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Calle deshabilitada',
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

  modalModificar(calle: Calles) {    
    this.id_calle = calle.id_calle;
    this.modalMod = true;
    this.Mod.patchValue({
      nombre: calle.nombre,
      id_lug: calle.id_lug,
      id_rut: calle.id_rut,
    });

    this.submittedMod = false;
  }
  
  modalHabilitar(calle: Calles) {
    this.id_calle = calle.id_calle;
    this.itemSelected = calle.nombre;
    this.modalEnable = true;
  }

  modalDeshabilitar(calle: Calles) {
    this.id_calle = calle.id_calle;
    this.itemSelected = calle.nombre;
    this.modalDisable = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
