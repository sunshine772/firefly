import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { Coordenadas } from 'src/app/api/models/coordenadas/coordenadas';
import { Lineas } from 'src/app/api/models/lineas/lineas';
import { Lugares } from 'src/app/api/models/lugares/lugares';
import { Municipios } from 'src/app/api/models/municipios/municipios';
import { Postes } from 'src/app/api/models/postes/postes';
import { CoordenadasService } from 'src/app/api/services/coordenadas/coordenadas.service';
import { LineasService } from 'src/app/api/services/lineas/lineas.service';
import { LugaresService } from 'src/app/api/services/lugares/lugares.service';
import { MunicipiosService } from 'src/app/api/services/municipios/municipios.service';
import { MapaPostesService } from 'src/app/api/services/postes/mapa-poste/mapa-poste.service';
import { PostesService } from 'src/app/api/services/postes/postes.service';

@Component({
  selector: 'app-postes',
  templateUrl: './postes.component.html',
  styleUrls: ['./postes.component.scss'],
  providers: [MessageService],
})
export class PostesComponent {
  poste = new Postes();
  linea = new Lineas();
  coordenada = new Coordenadas();

  postes: Postes[] = [];
  postesAdyacentes: Postes[] = [];
  lineas: Lineas[] = [];

  municipios: Municipios[] = [];
  lugares: Lugares[] = [];

  Add!: FormGroup;
  submittedAdd = false;
  Mod!: FormGroup;
  submittedMod = false;
  Enable!: FormGroup;
  submittedEnable = false;
  Disable!: FormGroup;
  submittedDisable = false;

  modalAdd = false;
  modalMod = false;
  modalDisable = false;
  modalEnable = false;
  modalDel = false;
  modalView = false;

  itemSelected = '';
  id_pos = 0;

  cols: any[] = [];
  tipo_poste: any[] = [];

  checked: boolean = false;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private postesService: PostesService,
    private coordenadasService: CoordenadasService,
    private lineasService: LineasService,
    private municipiosService: MunicipiosService,
    private lugaresService: LugaresService,
    private mapaPosteService: MapaPostesService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'n', header: 'N°' },
      { field: 'tipo_pos', header: 'Tipo' },
      { field: 'estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.tipo_poste = [
      { nombre: 'Alta tension', tipo_pos: 'A' },
      { nombre: 'Baja tension', tipo_pos: 'B' },
    ];

    this.listar();
    this.listarMunicipios();

    this.registerFormAdd();
    this.registerFormMod();
  }

  listar() {
    this.postesService.listar().subscribe((res) => {
      this.postes = res;
      // this.mapaPosteService.agregarPostes(this.postes);
      // this.listarLineas();
    });
  }

  listarLineas() {
    this.lineasService.listar().subscribe((res) => {
      console.log(res);

      this.lineas = res;
      this.mapaPosteService.agregarLineas(this.lineas, this.postes);
    });
  }

  listarMunicipios() {
    this.municipiosService.listar().subscribe((res) => {
      this.municipios = res;
    });
  }

  listarLugar(id_mu: number) {
    this.lugaresService.listarPorMunicipio(id_mu).subscribe((res) => {
      console.log(res);

      this.lugares = res;
    });
  }

  mostrarMapa() {
    this.mapaPosteService.buildMap().then((data) => {
      if (this.modalAdd) {
        this.mapaPosteService.puntero();
      }

      if (this.modalMod) {
        this.mapaPosteService.modificar(this.poste);
      }

      if (this.modalView) {
        this.mapaPosteService.mostrarPoste(this.poste);
      }
      
      this.mapaPosteService.coords.subscribe((res) => {
        this.coordenada.latitud = res.latitud;
        this.coordenada.longitud = res.longitud;
      });
    });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      tipo_pos: ['', Validators.required],
      id_mu: ['', Validators.required],

      id_coor: [''],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      tipo_pos: ['', Validators.required],
      id_mu: ['', Validators.required],

      id_coor: [''],
    });
  }

  adicionar() {
    this.submittedAdd = true;

    if (this.Add.valid) {
      this.poste.tipo_pos = this.Add.get('tipo_pos')?.value;

      this.coordenadasService.adicionar(this.coordenada).subscribe((res) => {
        this.poste.id_coor = res;

        this.postesService.adicionar(this.poste).subscribe((res) => {
          this.linea.nombre = 'a1';
          this.linea.inicio = this.postesAdyacentes[0].id_pos;
          this.linea.fin = res;

          this.lineasService.adicionar(this.linea).subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Poste adicionado',
              life: 5000,
            });
            this.modalAdd = false;
            this.listar();
          });
        });
      });
    } else {
      this.Add.markAllAsTouched();
    }
  }

  modificar() {
    this.submittedMod = true;

    if (this.Mod.valid) {
      this.poste.id_pos = this.id_pos;
      this.poste.tipo_pos = this.Mod.get('tipo_pos')?.value;
      this.poste.id_coor = this.Mod.get('id_coor')?.value;

      this.postesService.modificar(this.poste).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Poste modificado',
          life: 5000,
        });
        this.modalMod = false;
        this.listar();
      });
    } else {
      this.Mod.markAllAsTouched();
    }
  }

  eliminar() {
    this.lineasService.linea().subscribe((res) => {
      console.log(res);

      this.lineasService.eliminar(res).subscribe(() => {
        this.postesService.poste().subscribe((res) => {
          console.log(res);

          this.postesService.eliminar(res).subscribe(() => {
            this.coordenadasService.coordenada().subscribe((res) => {
              console.log(res);

              this.coordenadasService.eliminar(res).subscribe(() => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Exitoso',
                  detail: 'Poste eliminado',
                  life: 5000,
                });
                this.modalDel = false;
                this.listar();
                window.location.reload();
                // this.mapaPosteService.actualizarMapa()
              });
            });
          });
        });
      });
    });
  }

  habilitar() {
    this.postesService.habilitar(this.id_pos).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Poste habilitado',
        life: 5000,
      });
      this.modalEnable = false;
      this.listar();
    });
  }

  deshabilitar() {
    this.postesService.deshabilitar(this.id_pos).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Poste deshabilitado',
        life: 5000,
      });
      this.modalDisable = false;
      this.listar();
    });
  }

  modalAdicionar() {
    this.postesAdyacentes = this.mapaPosteService.posteAdyacente(
      this.postes,
      this.coordenada
    );

    this.modalAdd = true;
    this.Add.reset();
    this.submittedAdd = false;
  }

  modalModificar(poste: Postes) {
    this.id_pos = poste.id_pos;
    this.poste = poste;

    this.modalMod = true;
    this.Mod.patchValue({
      tipo_pos: poste.tipo_pos,
      id_coor: poste.id_coor,
    });
    this.submittedMod = false;
  }

  modalHabilitar(poste: Postes) {
    this.id_pos = poste.id_pos;
    this.itemSelected = this.transformRequestType(poste.tipo_pos).translation;
    this.modalEnable = true;
  }

  modalDeshabilitar(poste: Postes) {
    this.id_pos = poste.id_pos;
    this.itemSelected = this.transformRequestType(poste.tipo_pos).translation;
    this.modalDisable = true;
  }

  modalEliminar() {
    this.modalDel = true;
  }

  modalVisualizar(poste: Postes) {
    this.id_pos = poste.id_pos;
    this.itemSelected = poste.tipo_pos;
    this.modalView = true;
    this.poste = poste;
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

  seleccionarLugar(id_lug: number): void {
    const lugarSeleccionado = this.lugares.find(
      (lugar) => lugar.id_lug === id_lug
    );

    if (lugarSeleccionado) {
      this.mapaPosteService.mostrarLugar(lugarSeleccionado);
    }
  }

  cambiarCapa() {
    this.checked = !this.checked;

    if (this.checked) {
      this.mapaPosteService.cambiarEstilo(
        'mapbox://styles/mapbox/satellite-v9'
      );
    } else {
      this.mapaPosteService.cambiarEstilo(
        'mapbox://styles/sunshine772/cl979ypfr001414m9bcpwclzn'
      );
    }
  }

  transformRequestType(requestType: string): {
    translation: string;
    icon: string;
  } {
    switch (requestType) {
      case 'B':
        return { translation: 'Baja tension', icon: '' };
      case 'A':
        return { translation: 'Alta tension', icon: '' };
      default:
        return { translation: requestType, icon: '' };
    }
  }

  seleccionarMunicipio(id_mu: number): void {
    this.listarLugar(id_mu);
  }
}
