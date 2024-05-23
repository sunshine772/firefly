import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Tarifas } from 'src/app/api/models/tarifas/tarifas';
import { TarifasService } from 'src/app/api/services/tarifas/tarifas.service';

@Component({
  selector: 'app-tarifas',
  templateUrl: './tarifas.component.html',
  styleUrls: ['./tarifas.component.scss'],
  providers: [MessageService],
})
export class TarifasComponent {
  tarifa: Tarifas = new Tarifas();
  tarifas: Tarifas[] = [];

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
  id_tar: number = 0;

  cols: any[] = [];
  tipo_tar: any[] = [];

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private tarifasService: TarifasService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'n', header: 'N°' },
      { field: 'precio', header: 'Precio' },
      { field: 'tipo_tar', header: 'Tipo de tarifa' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.tipo_tar = [
      { tipo_tar: 'D', label: 'Domiciliario' },
      { tipo_tar: 'G', label: 'General' },
      // { tipo_med: 'I', label: 'Industrial' },
    ];

    this.listar();

    this.registerFormAdd();
    this.registerFormMod();
  }

  listar(): void {
    this.tarifasService.listar().subscribe((res) => {
      this.tarifas = res;
    });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      id_tar: [''],
      precio: ['', Validators.required],
      tipo_tar: [''],
      fecha: [''],
      estado: [false],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      id_tar: [''],
      precio: ['', Validators.required],
      tipo_tar: [''],
      fecha: [''],
      estado: [false],
    });
  }

  adicionar() {
    this.submittedAdd = true;

    if (this.Add.valid) {
      this.tarifa.precio = this.Add.get('precio')?.value;
      this.tarifa.tipo_tar = this.Add.get('tipo_tar')?.value;
      this.tarifa.fecha = this.Add.get('fecha')?.value;

      this.tarifasService.verificar(this.tarifa).subscribe((res) => {
        if (res) {
          this.tarifasService.adicionar(this.tarifa).subscribe((res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Tarifa adicionada',
              life: 5000,
            });
            this.modalAdd = false;
            this.listar();
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Tarifa ya existe',
            life: 5000,
          });
        }
      });
    } else {
      this.Add.markAllAsTouched();
    }
  }

  modificar() {
    this.submittedMod = true;

    if (this.Mod.valid) {
      this.tarifa.id_tar = this.Mod.get('id_tar')?.value;
      this.tarifa.precio = this.Mod.get('precio')?.value;
      this.tarifa.tipo_tar = this.Mod.get('tipo_tar')?.value;
      this.tarifa.fecha = this.Mod.get('fecha')?.value;

      console.log(this.tarifa);

      this.tarifasService.verificar(this.tarifa).subscribe((res) => {
        if (res) {
          this.tarifasService.modificar(this.tarifa).subscribe((res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Tarifa modificada',
              life: 5000,
            });
            this.modalMod = false;
            this.listar();
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Tarifa ya existe',
            life: 5000,
          });
        }
      });
    } else {
      this.Mod.markAllAsTouched();
    }
  }

  habilitar() {
    this.tarifasService.habilitar(this.id_tar).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Tarifa habilitada',
        life: 5000,
      });
      this.modalEnable = false;
      this.listar();
    });
  }

  deshabilitar() {
    this.tarifasService.deshabilitar(this.id_tar).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Tarifa deshabilitada',
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

  modalModificar(tarifa: Tarifas) {
    this.id_tar = tarifa.id_tar;
    this.modalMod = true;
    this.Mod.patchValue({
      id_tar: tarifa.id_tar,
      precio: tarifa.precio,
      tipo_tar: tarifa.tipo_tar,
      fecha: this.stringToDate(tarifa.fecha),
    });
    this.submittedMod = false;
  }

  modalHabilitar(tarifa: Tarifas) {
    this.id_tar = tarifa.id_tar;
    this.itemSelected = this.transformRequestType(tarifa.tipo_tar).translation;
    this.modalEnable = true;
  }

  modalDeshabilitar(tarifa: Tarifas) {
    this.id_tar = tarifa.id_tar;
    this.itemSelected = this.transformRequestType(tarifa.tipo_tar).translation;
    this.modalDisable = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // // Método para convertir un objeto Date a un string en formato "yyyy-mm-dd"
  // dateToString(date: Date): string {
  //   const year = date.getFullYear();
  //   const month = ('0' + (date.getMonth() + 1)).slice(-2);
  //   const day = ('0' + date.getDate()).slice(-2);
  //   return `${year}-${month}-${day}`;
  // }

  // // Método para convertir un string en formato "yyyy-mm-dd" a un objeto Date
  stringToDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  transformRequestType(requestType: string): {
    translation: string;
    icon: string;
  } {
    switch (requestType) {
      case 'D':
        return { translation: 'Domiciliario', icon: '' };
      case 'G':
        return { translation: 'General', icon: '' };
      case 'I':
        return { translation: 'Industrial', icon: '' };
      default:
        return { translation: requestType, icon: '' };
    }
  }
}
