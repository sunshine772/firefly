import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { mergeMap, finalize, forkJoin } from 'rxjs';
import { Coordenadas } from 'src/app/api/models/coordenadas/coordenadas';
import { Lugares } from 'src/app/api/models/lugares/lugares';
import { Medidores } from 'src/app/api/models/medidores/medidores';
import { Rutas } from 'src/app/api/models/rutas/rutas';
import { CoordenadasService } from 'src/app/api/services/coordenadas/coordenadas.service';
import { LugaresService } from 'src/app/api/services/lugares/lugares.service';
import { MapaMedidorService } from 'src/app/api/services/medidores/mapa-medidor/mapa-medidor.service';
import { MedidoresService } from 'src/app/api/services/medidores/medidores.service';
import { MapaRutaService } from 'src/app/api/services/rutas/mapa-ruta/mapa-ruta.service';
import { RutasService } from 'src/app/api/services/rutas/rutas.service';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.component.html',
  styleUrls: ['./rutas.component.scss'],
  providers: [MessageService],
})
export class RutasComponent implements OnInit {
  ruta = new Rutas();
  medidor = new Medidores();
  coordenada = new Coordenadas();

  rutas: Rutas[] = [];
  coordenadas: Coordenadas[] = [];
  lugares: Lugares[] = [];
  medidores: Medidores[] = [];
  medidoresNuevos: Medidores[] = [];

  Add!: FormGroup;
  submittedAdd = false;
  Mod!: FormGroup;
  submittedMod = false;

  modalAdd = false;
  modalMod = false;
  modalEnable = false;
  modalDisable = false;
  modalAddM = false;
  modalDelM = false;
  modalView = false;
  modalViewM = false;

  itemSelected = '';
  id_rut: number = 0;
  id_med: number = 0;

  cols: any[] = [];
  colsMedidores: any[] = [];

  checked: boolean = false;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private rutasService: RutasService,
    private mapaRutaService: MapaRutaService,
    private medidoresService: MedidoresService,
    private lugaresService: LugaresService,
    private mapaMedidorService: MapaMedidorService
  ) {}

  ngOnInit() {
    this.cols = [
      // { field: 'n', header: '' },
      { field: 'n', header: 'N°' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'lugares.nombre', header: 'Lugar' },
      { field: 'estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.colsMedidores = [
      { field: 'n', header: 'N°' },
      { field: 'medidores.tipo_med', header: 'Tipo de medidor' },
      { field: 'medidores.estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.listar();
    this.listarLugares();
    this.listarMedidoresNuevos();

    this.registerFormAdd();
    this.registerFormMod();
  }

  listar() {
    this.rutasService.listar().subscribe((res) => {
      console.log(res);
      this.rutas = res;
    });
  }

  listarLugares() {
    this.lugaresService.listar().subscribe((res) => {
      this.lugares = res;
    });
  }

  listarMedidoresNuevos() {
    this.medidoresService.listarNuevos().subscribe((res) => {
      this.medidoresNuevos = res;
    });
  }

  listarMedidores(id_rut: number) {
    this.medidoresService.listarMedidoresRutas(id_rut).subscribe((res) => {
      this.medidores = res;
    });
  }

  mostrarMapa() {
    this.mapaRutaService
      .buildMap()
      .then((data) => {
        this.mapaRutaService.obtenerRutaMasCortaEntrePuntos(this.medidores);
      })
      .catch((error) => {
        console.log('error ', error);
      });
  }

  mostrarMapaMedidor() {
    this.mapaMedidorService
      .buildMap()
      .then((data) => {
        console.log('ok ', data);
        if (this.modalViewM) {
          this.mapaMedidorService.mostrarMedidor(this.medidor);
        }
        this.mapaMedidorService.adicionar();
        this.mapaMedidorService.coords.subscribe((res) => {
          this.coordenada.latitud = res.latitud;
          this.coordenada.longitud = res.longitud;
        });
      })
      .catch((error) => {
        console.log('error ', error);
      });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      id_rut: [''],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      id_lug: ['', Validators.required],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      id_rut: [''],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      id_lug: ['', Validators.required],
    });
  }

  adicionar() {
    this.submittedAdd = true;

    if (this.Add.valid) {
      this.ruta.nombre = this.Add.get('nombre')?.value.toUpperCase();
      this.ruta.id_lug = this.Add.get('id_lug')?.value;

      this.rutasService.adicionar(this.ruta).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Ruta adicionada',
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
      this.ruta.id_rut = this.Mod.get('id_rut')?.value;
      this.ruta.nombre = this.Mod.get('nombre')?.value.toUpperCase();
      this.ruta.id_lug = this.Mod.get('id_lug')?.value;

      this.rutasService.modificar(this.ruta).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Ruta modificada',
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
    this.rutasService.habilitar(this.id_rut).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Ruta habilitada',
        life: 5000,
      });
      this.modalEnable = false;
      this.listar();
    });
  }

  deshabilitar() {
    this.rutasService.deshabilitar(this.id_rut).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Ruta deshabilitada',
        life: 5000,
      });
      this.modalDisable = false;
      this.listar();
    });
  }

  adicionarMedidor(event: any) {
    if (event.items && event.items.length > 0) {
      const formData: FormData = new FormData();
      formData.append('id_rut', this.id_rut.toString());
      formData.append('id_med', event.items[0].id_med.toString());
      this.rutasService.adicionarMedidorRuta(formData).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Medidor adicionado',
          life: 5000,
        });
        // this.modalView = false;
        this.listarMedidoresNuevos();
        this.listar();

        // this.listarMedidoresAdicionados();
      });
    }
  }

  eliminarMedidor(event: any) {
    if (event.items && event.items.length > 0) {
      this.rutasService
        .eliminarMedidorRuta(this.id_rut, event.items[0].id_med)
        .subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exitoso',
            detail: 'Medidor eliminado',
            life: 5000,
          });
          this.listarMedidores(this.id_rut);
          this.listar();
          // this.modalView = false;
          // this.listarMedidoresNuevos();
          // this.listarMedidoresAdicionados();
        });
    }
  }

  modalAdicionar() {
    this.modalAdd = true;
    this.Add.reset();
    this.submittedAdd = false;
    this.coordenadas = [];
  }

  modalModificar(ruta: Rutas) {
    this.id_rut = ruta.id_rut;
    this.modalMod = true;
    this.Mod.patchValue({
      id_rut: ruta.id_rut,
      nombre: ruta.nombre,
      id_lug: ruta.id_lug,
    });
    this.submittedMod = false;
  }

  modalHabilitar(ruta: Rutas) {
    this.id_rut = ruta.id_rut;
    this.itemSelected = ruta.nombre;
    this.modalEnable = true;
  }

  modalDeshabilitar(ruta: Rutas) {
    this.id_rut = ruta.id_rut;
    this.itemSelected = ruta.nombre;
    this.modalDisable = true;
  }

  modalVisualizarRuta(ruta: Rutas) {
    this.medidores = ruta.medidores;
    console.log(this.medidores);
    this.modalView = true;
  }

  modalAdicionarMedidor(ruta: Rutas) {
    this.id_rut = ruta.id_rut;
    this.listarMedidores(this.id_rut);
    this.modalAddM = true;
  }

  modalEliminarMedidor() {
    this.modalDelM = true;
  }

  modalVisualizarMedidor(medidor: Medidores) {
    this.medidor = medidor;
    this.itemSelected = this.transformRequestType(medidor.tipo_med).translation;
    this.modalViewM = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  search(event: any) {
    const query = event.query;
    this.lugaresService.listar().subscribe((res: Lugares[]) => {
      this.lugares = res.filter((lugar: Lugares) =>
        lugar.nombre.toLowerCase().includes(query.toLowerCase())
      );
    });
  }

  seleccionarLugar(lugar: Lugares): void {
    this.mapaRutaService.mostrarLugar(lugar);
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
        return { translation: 'Industrial', icon: '' };
      default:
        return { translation: requestType, icon: '' };
    }
  }

  getImagenUrl(imagen: string): string {
    return 'data:image/png;base64,' + imagen;
  }

  cambiarCapa() {
    this.checked = !this.checked;

    if (this.checked) {
      this.mapaRutaService.cambiarEstilo('mapbox://styles/mapbox/satellite-v9');
    } else {
      this.mapaRutaService.cambiarEstilo(
        'mapbox://styles/sunshine772/cl979ypfr001414m9bcpwclzn'
      );
    }
  }

  cambiarCapaMedidor() {
    this.checked = !this.checked;

    if (this.checked) {
      this.mapaMedidorService.cambiarEstilo(
        'mapbox://styles/mapbox/satellite-v9'
      );
    } else {
      this.mapaMedidorService.cambiarEstilo(
        'mapbox://styles/sunshine772/cl979ypfr001414m9bcpwclzn'
      );
    }
  }
}
