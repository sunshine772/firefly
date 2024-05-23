import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Consumos } from 'src/app/api/models/consumos/consumos';
import { ConsumosService } from 'src/app/api/services/consumos/consumos.service';
import { Lecturaciones } from 'src/app/api/models/lecturaciones/lecturaciones';
import { Tarifas } from 'src/app/api/models/tarifas/tarifas';

@Component({
  selector: 'app-consumos',
  templateUrl: './consumos.component.html',
  styleUrls: ['./consumos.component.scss'],
  providers: [MessageService],
})
export class ConsumosComponent {
  consumo = new Consumos();
  consumos: Consumos[] = [];

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
  id_cons: number = 0;

  cols: any[] = [];

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private consumosService: ConsumosService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'n', header: 'N°' },
      { field: 'lecturaciones.medidores.clientes.personas.nombre', header: 'Cliente' },
      { field: 'tipo_med', header: 'Tipo medidor' },
      { field: 'consumo', header: 'Consumo' },
      { field: 'total', header: 'Total' },
    ];

    this.listar();

    this.registerFormAdd();
    this.registerFormMod();
  }

  listar(): void {
    this.consumosService.listar().subscribe((res) => {
      this.consumos = res;
    });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      id_cons: [''],
      consumo: ['', Validators.required],
      periodo: [''],
      observacion: [''],
      total: ['', Validators.required],
      id_lect: ['', Validators.required],
      id_tar: ['', Validators.required],
      lecturaciones: [''],
      tarifas: [''],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      id_cons: [''],
      consumo: ['', Validators.required],
      periodo: [''],
      observacion: [''],
      total: ['', Validators.required],
      id_lect: ['', Validators.required],
      id_tar: ['', Validators.required],
      lecturaciones: [''],
      tarifas: [''],
    });
  }

  adicionar() {
    this.submittedAdd = true;

    if (this.Add.valid) {
      this.consumo.consumo = this.Add.get('consumo')?.value;
      this.consumo.fecha = this.Add.get('fecha')?.value;
      this.consumo.observacion = this.Add.get('observacion')?.value;
      this.consumo.total = this.Add.get('total')?.value;
      this.consumo.id_lec = this.Add.get('id_lec')?.value;
      this.consumo.id_tar = this.Add.get('id_tar')?.value;

      this.consumosService.adicionar(this.consumo).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Consumo adicionado',
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
      this.consumo.id_cons = this.id_cons;
      this.consumo.consumo = this.Mod.get('consumo')?.value;
      this.consumo.fecha = this.Mod.get('fecha')?.value;
      this.consumo.observacion = this.Mod.get('observacion')?.value;
      this.consumo.total = this.Mod.get('total')?.value;
      this.consumo.id_lec = this.Mod.get('id_lec')?.value;
      this.consumo.id_tar = this.Mod.get('id_tar')?.value;

      this.consumosService.modificar(this.consumo).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Consumo modificado',
          life: 3000,
        });
        this.modalMod = false;
        this.listar();
      });
    } else {
      this.Mod.markAllAsTouched();
    }
  }

  // habilitar() {
  //   this.consumosService.habilitar(this.id_cons).subscribe((res) => {
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Exitoso',
  //       detail: 'Consumo habilitado',
  //       life: 3000,
  //     });
  //     this.modalEnable = false;
  //     this.listar();
  //   });
  // }

  // deshabilitar() {
  //   this.consumosService.deshabilitar(this.id_cons).subscribe((res) => {
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Exitoso',
  //       detail: 'Consumo deshabilitado',
  //       life: 3000,
  //     });
  //     this.modalDisable = false;
  //     this.listar();
  //   });
  // }

  modalAdicionar() {
    this.modalAdd = true;
    this.Add.reset();
    this.submittedAdd = false;
  }

  modalModificar(consumo: Consumos) {
    this.id_cons = consumo.id_cons;
    this.modalMod = true;
    this.Mod.patchValue({
      consumo: consumo.consumo,
      fecha: consumo.fecha,
      observacion: consumo.observacion,
      total: consumo.total,
      id_lec: consumo.id_lec,
      id_tar: consumo.id_tar,
    });
    this.submittedMod = false;
  }

  modalHabilitar(consumo: Consumos) {
    this.id_cons = consumo.id_cons;
    // this.itemSelected = consumo.consumo;
    this.modalEnable = true;
  }

  modalDeshabilitar(consumo: Consumos) {
    this.id_cons = consumo.id_cons;
    // this.itemSelected = consumo.consumo;
    this.modalDisable = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  transformRequestType(requestType: string): {
    translation: string;
    icon: string;
  } {
    switch (requestType) {
      case 'D':
        return { translation: 'Domiciliario', icon: 'pi pi-home' };
      case 'G':
        return { translation: 'General', icon: 'pi pi-building' };
      case 'I':
        return { translation: 'Industrial', icon: 'pi pi-image' };
      default:
        return { translation: requestType, icon: '' };
    }
  }

  calculateTotal(fecha: string): number {
    let total = 0;

    if (this.consumos) {
      for (let consumo of this.consumos) {
        if (consumo.fecha === fecha) {
          total++;
        }
      }
    }

    return total;
  }
}
