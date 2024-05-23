import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, pipe, throwError } from 'rxjs';
import { Consumos } from 'src/app/api/models/consumos/consumos';
import { Lecturaciones } from 'src/app/api/models/lecturaciones/lecturaciones';
import { ConsumosService } from 'src/app/api/services/consumos/consumos.service';
import { LecturacionesService } from 'src/app/api/services/lecturaciones/lecturaciones.service';

@Component({
  selector: 'app-lecturaciones',
  templateUrl: './lecturaciones.component.html',
  styleUrls: ['./lecturaciones.component.scss'],
  providers: [MessageService],
})
export class LecturacionesComponent {
  lecturacion = new Lecturaciones();
  lecturaciones: Lecturaciones[] = [];
  selectedLecturaciones: Lecturaciones[] = [];
  consumos: Consumos[] = [];

  checked: boolean = true;

  Add!: FormGroup;
  submittedAdd = false;
  Mod!: FormGroup;
  submittedMod = false;
  submittedGenerate = false;
  submittedImport = false;

  modalAdd: boolean = false;
  modalMod: boolean = false;
  modalImport: boolean = false;
  modalGenerate: boolean = false;

  cols: any[] = [];

  selectedFile!: File;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private lecturacionesService: LecturacionesService,
    private consumosService: ConsumosService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'n', header: 'N°' },
      { field: 'medidores.clientes.personas.nombre', header: 'Cliente' },
      { field: 'empleados.personas.nombre', header: 'Empleado' },
      { field: 'medidores.id_med', header: 'Medidor' },
      { field: 'rutas.nombre', header: 'Ruta' },
      { field: 'lectura_anterior', header: 'Lectura Anterior' },
      { field: 'lectura_actual', header: 'Lectura Actual' },
      { field: 'irregularidad', header: 'Irregularidad' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.listar();
    this.listarConsumos();

    this.registerFormAdd();
    this.registerFormMod();
  }

  listar(): void {
    this.lecturacionesService.listar().subscribe((res) => {
      this.lecturaciones = res;
    });
  }

  listarConsumos() {
    this.consumosService.listar().subscribe((res) => {
      this.consumos = res;

      // this.consumos.forEach((consumo) => {
      //   const lecturacion = this.lecturaciones.find(
      //     (lecturacion) => lecturacion.id_lec === consumo.lecturaciones.id_lec
      //   );

      //   // if (lecturacion) {
      //   //   this.checked = true;
      //   // }
      // });
    });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      id_lec: [''],
      fecha: ['', Validators.required],
      observacion: [''],
      lectura_anterior: ['', Validators.required],
      lectura_actual: ['', Validators.required],
      irregularidad: [''],
      id_rut: ['', Validators.required],
      id_med: ['', Validators.required],
      id_emp: ['', Validators.required],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      id_lec: [''],
      fecha: ['', Validators.required],
      observacion: [''],
      lectura_anterior: ['', Validators.required],
      lectura_actual: ['', Validators.required],
      irregularidad: [''],
      id_rut: ['', Validators.required],
      id_med: ['', Validators.required],
      id_emp: ['', Validators.required],
    });
  }

  adicionar() {
    this.submittedAdd = true;

    if (this.Add.valid) {
      this.lecturacion.fecha = this.Add.get('fecha')?.value;
      this.lecturacion.observacion = this.Add.get('observacion')?.value;
      this.lecturacion.lectura_anterior =
        this.Add.get('lectura_anterior')?.value;
      this.lecturacion.lectura_actual = this.Add.get('lectura_actual')?.value;
      this.lecturacion.irregularidad = this.Add.get('irregularidad')?.value;
      this.lecturacion.id_rut = this.Add.get('id_rut')?.value;
      this.lecturacion.id_med = this.Add.get('id_med')?.value;
      this.lecturacion.id_emp = this.Add.get('id_emp')?.value;

      this.lecturacionesService.adicionar(this.lecturacion).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Lecturación adicionada',
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
      this.lecturacion.id_lec = this.Mod.get('id_lec')?.value;
      this.lecturacion.fecha = this.Mod.get('fecha')?.value;
      this.lecturacion.observacion = this.Mod.get('observacion')?.value;
      this.lecturacion.lectura_anterior =
        this.Mod.get('lectura_anterior')?.value;
      this.lecturacion.lectura_actual = this.Mod.get('lectura_actual')?.value;
      this.lecturacion.irregularidad = this.Mod.get('irregularidad')?.value;
      this.lecturacion.id_rut = this.Mod.get('id_rut')?.value;
      this.lecturacion.id_med = this.Mod.get('id_med')?.value;
      this.lecturacion.id_emp = this.Mod.get('id_emp')?.value;

      this.lecturacionesService.modificar(this.lecturacion).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Lecturación modificada',
          life: 5000,
        });
        this.modalMod = false;
        this.listar();
      });
    } else {
      this.Mod.markAllAsTouched();
    }
  }

  importar() {
    if (this.selectedFile) {
      this.lecturacionesService
        .adicionarLecturaciones(this.selectedFile)
        .subscribe(
          (res) => {
            if (res === -3) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  'Tipo de archivo no compatible. Solo se admiten archivos JSON',
                life: 5000,
              });
            } else if (res === -2) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Datos duplicados',
                life: 5000,
              });
            } else if (res >= 0) {
              this.messageService.add({
                severity: 'success',
                summary: 'Exitoso',
                detail: `Se agregaron ${res} lecturaciones`,
                life: 5000,
              });
              this.modalImport = false;
              this.listar();
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al procesar el archivo de lecturaciones',
              life: 5000,
            });
          }
        );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Seleccione un archivo de lecturaciones',
        life: 5000,
      });
    }
  }

  generar(): void {
    if (this.selectedLecturaciones.length > 0) {
      const lecturacionesNoAdicionadas = this.selectedLecturaciones.filter(
        (lecturacion) => !this.isLecturacionAdicionada(lecturacion)
      );

      if (lecturacionesNoAdicionadas.length > 0) {
        this.consumosService
          .adicionarConsumos(lecturacionesNoAdicionadas)
          .subscribe(
            (res) => {
              console.log(res);
              
              if (res > 0) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Consumos adicionados correctamente',
                  life: 5000,
                });
                this.modalGenerate = false;
                // this.lecturaciones = [];
                // this.listar();
                window.location.reload();
              } else if (res === -1) {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Error en la inserción de consumos',
                  life: 5000,
                });
                this.modalGenerate = false;
              } else if (res === -2) {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail:
                    'No se encontró la tarifa para la fecha y tipo de tarifa especificados',
                  life: 5000,
                });
                this.modalGenerate = false;
              }
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error inesperado',
                life: 5000,
              });
              this.modalGenerate = false;
            }
          );
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No hay lecturaciones seleccionadas',
          life: 5000,
        });
        this.modalGenerate = false;
        this.listar();
        this.listarConsumos();
      }
    }
  }

  modalAdicionar() {
    this.modalAdd = true;
    this.Add.reset();
    this.submittedAdd = false;
  }

  modalModificar(lecturacion: Lecturaciones) {
    this.lecturacion.id_lec = lecturacion.id_lec;
    this.modalMod = true;
    this.Mod.patchValue({
      fecha: lecturacion.fecha,
      observacion: lecturacion.observacion,
      lectura_anterior: lecturacion.lectura_anterior,
      lectura_actual: lecturacion.lectura_actual,
      irregularidad: lecturacion.irregularidad,
      id_rut: lecturacion.id_rut,
      id_med: lecturacion.id_med,
      id_emp: lecturacion.id_emp,
    });
    this.submittedMod = false;
  }

  modalImportar() {
    this.modalImport = true;
    this.submittedImport = false;
  }

  modalGenerar() {
    this.modalGenerate = true;
    this.submittedGenerate = false;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  calculateTotal(fecha: String): number {
    let total = 0;

    if (this.lecturaciones) {
      for (let lectura of this.lecturaciones) {
        if (lectura.fecha === fecha) {
          total++;
        }
      }
    }

    return total;
  }

  handleUpload(event: any) {
    this.selectedFile = event.files[0];
  }

  isLecturacionAdicionada(lecturacion: Lecturaciones): boolean {
    return this.consumos.some(
      (consumo) => consumo.lecturaciones.id_lec === lecturacion.id_lec
    );
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

  getIrregularityInfo(irregularity: string): {
    label: string;
    severity: string;
  } {
    switch (irregularity) {
      case 'N':
        return { label: 'Normal', severity: 'success' };
      case 'A':
        return { label: 'Alto cosumo', severity: 'danger' };
      case 'R':
        return { label: 'Revisión', severity: 'warning' };
      default:
        return { label: irregularity, severity: 'info' };
    }
  }

  onRowEditInit(lecturacion: Lecturaciones) {
    this.Mod.patchValue({
      id_lec: lecturacion.id_lec,
      fecha: this.stringToDate(lecturacion.fecha),
      observacion: lecturacion.observacion,
      lectura_anterior: lecturacion.lectura_anterior,
      lectura_actual: lecturacion.lectura_actual,
      irregularidad: lecturacion.irregularidad,
      id_rut: lecturacion.id_rut,
      id_med: lecturacion.id_med,
      id_emp: lecturacion.id_emp,
    });
  }

  onRowEditSave() {
    this.lecturacion.id_lec = this.Mod.get('id_lec')?.value;
    this.lecturacion.fecha = this.Mod.get('fecha')?.value;
    this.lecturacion.observacion = this.Mod.get('observacion')?.value;
    this.lecturacion.lectura_anterior = this.Mod.get('lectura_anterior')?.value;
    this.lecturacion.lectura_actual = this.Mod.get('lectura_actual')?.value;
    this.lecturacion.irregularidad = this.Mod.get('irregularidad')?.value;
    this.lecturacion.id_rut = this.Mod.get('id_rut')?.value;
    this.lecturacion.id_med = this.Mod.get('id_med')?.value;
    this.lecturacion.id_emp = this.Mod.get('id_emp')?.value;

    this.lecturacionesService.modificar(this.lecturacion).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Lecturación modificada',
        life: 5000,
      });
      this.listar();
    });
  }

  onRowEditCancel(lecturacion: Lecturaciones, index: number) {
    this.Mod.reset();
  }

  stringToDate(dateString: String): Date {
    const [year, month, day] = dateString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
}
