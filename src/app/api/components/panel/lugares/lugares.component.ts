import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Coordenadas } from 'src/app/api/models/coordenadas/coordenadas';
import { Lugares } from 'src/app/api/models/lugares/lugares';
import { Municipios } from 'src/app/api/models/municipios/municipios';
import { CoordenadasService } from 'src/app/api/services/coordenadas/coordenadas.service';
import { LugaresService } from 'src/app/api/services/lugares/lugares.service';
import { MapaLugarService } from 'src/app/api/services/lugares/mapa-lugar/mapa-lugar.service';
import { MunicipiosService } from 'src/app/api/services/municipios/municipios.service';

@Component({
  selector: 'app-lugares',
  templateUrl: './lugares.component.html',
  styleUrls: ['./lugares.component.scss'],
  providers: [MessageService],
})
export class LugaresComponent {
  lugar = new Lugares();
  coordenada = new Coordenadas();
  lugares: Lugares[] = [];
  municipios: Municipios[] = [];

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
  modalView: boolean = false;

  itemSelected: string = '';
  id_lug: number = 0;
  id_coor: number = 0;

  cols: any[] = [];

  checked: boolean = false;
  coordenadasModificacion: boolean = false;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private lugaresService: LugaresService,
    private municipiosService: MunicipiosService,
    private coordenadasService: CoordenadasService,
    private mapaLugarService: MapaLugarService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'n', header: 'N°' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'municipios.nombre', header: 'Municipio' },
      { field: 'estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.listar();
    this.listarMunicipios();

    this.registerFormAdd();
    this.registerFormMod();
  }

  listar(): void {
    this.lugaresService.listar().subscribe((res) => {
      this.lugares = res;
      console.log(res);
    });
  }

  listarMunicipios() {
    this.municipiosService.listar().subscribe((res) => {
      this.municipios = res;
    });
  }

  mostrarMapa() {
    this.mapaLugarService.buildMap().then((data) => {
      if (this.modalMod) {
        this.mapaLugarService.modificar(this.lugar);
      }
      if (this.modalView) {
        this.mapaLugarService.mostrarLugar(this.lugar);
      }

      this.mapaLugarService.coords.subscribe((res) => {
        this.coordenada.latitud = res.latitud;
        this.coordenada.longitud = res.longitud;
      });
    });
  }

  mostrarMapaModificar() {
    // this.mapaLugarService.map.setCenter()
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      id_lug: [''],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      estado: [''],
      id_mu: ['', Validators.required],
      id_coor: [''],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      id_lug: [''],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      estado: [''],
      id_mu: ['', Validators.required],
      id_coor: [''],
    });
  }

  adicionar() {
    this.submittedAdd = true;

    if (this.Add.valid) {
      this.coordenadasService.adicionar(this.coordenada).subscribe((res) => {
        this.lugar.nombre = this.Add.get('nombre')?.value.toUpperCase();
        this.lugar.id_mu = this.Add.get('id_mu')?.value;
        this.lugar.id_coor = res;

        this.lugaresService.adicionar(this.lugar).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exitoso',
            detail: 'Lugar adicionado',
            life: 5000,
          });
          this.modalAdd = false;
          this.listar();
        });
      });
    } else {
      this.Add.markAllAsTouched();
    }
  }

  modificar() {
    this.submittedMod = true;

    if (this.Mod.valid) {
      this.coordenada.id_coor = this.id_coor;
      this.coordenadasService.modificar(this.coordenada).subscribe((res) => {
        this.lugar.id_lug = this.id_lug;
        this.lugar.nombre = this.Mod.get('nombre')?.value.toUpperCase();
        this.lugar.id_mu = this.Mod.get('id_mu')?.value;
        this.lugar.id_coor = this.id_coor;

        this.lugaresService.modificar(this.lugar).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exitoso',
            detail: 'Lugar modificado',
            life: 5000,
          });
          this.modalMod = false;
          this.listar();
        });
      });
    } else {
      this.Mod.markAllAsTouched();
    }
  }

  habilitar() {
    this.lugaresService.habilitar(this.id_lug).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Lugar habilitado',
        life: 5000,
      });
      this.modalEnable = false;
      this.listar();
    });
  }

  deshabilitar() {
    this.lugaresService.deshabilitar(this.id_lug).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Lugar deshabilitado',
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

  modalModificar(lugar: Lugares) {
    this.id_lug = lugar.id_lug;
    this.id_coor = lugar.coordenadas.id_coor;

    this.lugar = lugar;

    this.modalMod = true;
    this.Mod.patchValue({
      nombre: lugar.nombre,
      id_mu: lugar.municipios.id_mu,
    });
    this.submittedMod = false;
  }

  modalHabilitar(lugar: Lugares) {
    this.id_lug = lugar.id_lug;
    this.itemSelected = lugar.nombre;
    this.modalEnable = true;
  }

  modalDeshabilitar(lugar: Lugares) {
    this.id_lug = lugar.id_lug;
    this.itemSelected = lugar.nombre;
    this.modalDisable = true;
  }

  modalVisualizar(lugar: Lugares) {
    this.modalView = true;
    this.lugar = lugar;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  cambiarCapa() {
    this.checked = !this.checked;

    if (this.checked) {
      this.mapaLugarService.cambiarEstilo(
        'mapbox://styles/mapbox/satellite-v9'
      );
    } else {
      this.mapaLugarService.cambiarEstilo(
        'mapbox://styles/sunshine772/cl979ypfr001414m9bcpwclzn'
      );
    }
  }
}
