import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Actividades } from 'src/app/api/models/actividades/actividades';
import { ActividadesService } from 'src/app/api/services/actividades/actividades.service';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.scss'],
  providers: [MessageService],
})
export class ActividadesComponent {
  actividades: Actividades[] = [];

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

  cols: any[] = [];

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private actividadesService: ActividadesService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'n', header: 'N°' },
      { field: 'empleado', header: 'Empleado' },
      { field: 'labor', header: 'Labor' },
      { field: 'hora programada', header: 'Hora programada' },
      { field: 'hora real', header: 'Hora real' },
      { field: 'operacion', header: 'Operacion' },
      { field: 'estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' }
  ];

    this.listar();

    this.registerFormAdd();
    this.registerFormMod();
  }

  listar(): void {
    this.actividadesService.listar().subscribe((res) => {
      this.actividades = res;
    });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      id_act: ['', Validators.required],
      nombre: ['', Validators.required],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      id_act: ['', Validators.required],
      nombre: ['', Validators.required],
    });
  }

  adicionar() {
    this.submittedAdd = true;

    if (this.Add.valid) {
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Actividad adicionada', life: 3000 });
      this.modalAdd = false;
    } else {
      this.Add.markAllAsTouched();
    }
  }

  modificar() {
    this.submittedMod = true;

    if (this.Mod.valid) {
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Actividad modificada', life: 3000 });
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


  modalAdicionar() {
    this.modalAdd = true;
    this.Add.reset();
    this.submittedAdd = false;
  }
  modalModificar() {
    this.modalMod = true;
    this.Mod.reset();
    this.submittedMod = false;
  }
  modalHabilitar() {
    this.modalEnable = true;
  }
  modalDeshabilitar() {
    this.modalDisable = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
