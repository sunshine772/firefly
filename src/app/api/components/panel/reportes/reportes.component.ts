import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Clientes } from 'src/app/api/models/clientes/clientes';
import { Rutas } from 'src/app/api/models/rutas/rutas';
import { ReportesService } from 'src/app/api/services/reportes/reportes.service';
import { RutasService } from 'src/app/api/services/rutas/rutas.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
  providers: [MessageService],
})
export class ReportesComponent {
  // loading: boolean = false;

  clientes: Clientes[] = [];
  rutas: Rutas[] = [];
  filteredRutas: Rutas[] = [];

  pdf: string = '../assets/sample.pdf';

  formGroup!: FormGroup;

  Lec!: FormGroup;
  submittedLec = false;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private rutasService: RutasService,
    private reportesService: ReportesService
  ) {}

  ngOnInit() {
    this.listarRutas();
    this.registerFormLec();
  }

  listarRutas() {
    this.rutasService.listar().subscribe((res) => {
      this.rutas = res;
    });
  }

  registerFormLec() {
    this.Lec = this.formBuilder.group({
      rutas: ['', Validators.required],
      fecha: ['', Validators.required],
    });
  }

  generarLecturaciones() {
    this.submittedLec = true;

    if (this.Lec.valid) {
      const id_rut = this.Lec.get('rutas')?.value.id_rut;
      const fecha = this.Lec.get('fecha')?.value.toISOString();

      const formData: FormData = new FormData();
      formData.append('id_rut', id_rut);
      formData.append('fecha', fecha);

      this.reportesService.generarJson(formData).subscribe((res) => {
        if (res > 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Lecturación generada y guardada correctamente',
            life: 5000,
          });
        } else if (res === -1) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al generar la lecturación',
            life: 5000,
          });
        }
      });
    } else {
      this.Lec.markAllAsTouched();
    }
  }

  // load() {
  //   this.loading = true;

  //   setTimeout(() => {
  //     this.loading = false;
  //   }, 2000);
  // }

  filter(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.rutas as any[]).length; i++) {
      let country = (this.rutas as any[])[i];
      if (country.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }

    this.filteredRutas = filtered;
  }
}
