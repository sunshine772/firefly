import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Clientes } from 'src/app/api/models/clientes/clientes';
import { Coordenadas } from 'src/app/api/models/coordenadas/coordenadas';
import { Lugares } from 'src/app/api/models/lugares/lugares';
import { Medidores } from 'src/app/api/models/medidores/medidores';
import { ClientesService } from 'src/app/api/services/clientes/clientes.service';
import { CoordenadasService } from 'src/app/api/services/coordenadas/coordenadas.service';
import { LugaresService } from 'src/app/api/services/lugares/lugares.service';
import { MapaMedidorService } from 'src/app/api/services/medidores/mapa-medidor/mapa-medidor.service';
import { MedidoresService } from 'src/app/api/services/medidores/medidores.service';

@Component({
  selector: 'app-medidores',
  templateUrl: './medidores.component.html',
  styleUrls: ['./medidores.component.scss'],
  providers: [MessageService],
})
export class MedidoresComponent {
  medidor = new Medidores();
  coordenada = new Coordenadas();

  medidores: Medidores[] = [];
  clientes: Clientes[] = [];
  filteredClientes: Clientes[] = [];
  lugares: Lugares[] = [];

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
  id_med: number = 0;
  id_coor: number = 0;

  cols: any[] = [];
  tipo_medidor: any[] = [];

  checked: boolean = false;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private medidoresService: MedidoresService,
    private coordenadasService: CoordenadasService,
    private clientesService: ClientesService,
    private lugaresService: LugaresService,
    private mapaMedidorService: MapaMedidorService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'n', header: 'N°' },
      { field: 'clientes.personas.ci', header: 'CI' },
      { field: 'clientes.personas.nombre', header: 'Cliente' },
      { field: 'tipo_med', header: 'Tipo de Medidor' },
      { field: 'estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.tipo_medidor = [
      { tipo_med: 'D', nombre: 'Domiciliario' },
      { tipo_med: 'G', nombre: 'General' },
      { tipo_med: 'I', nombre: 'Industrial' },
    ];

    this.listar();
    this.listarClientes();

    this.registerFormAdd();
    this.registerFormMod();
  }

  listar(): void {
    this.medidoresService.listar().subscribe((res) => {
      this.medidores = res;
      console.log(res);
    });
  }

  listarClientes() {
    this.clientesService.listar().subscribe((res) => {
      this.clientes = res;
    });
  }

  listarLugares() {
    this.lugaresService.listar().subscribe((res) => {
      this.lugares = res;
    });
  }

  mostrarMapa() {
    this.mapaMedidorService.buildMap().then((data) => {
      if (this.modalAdd) {
        this.mapaMedidorService.adicionar();
      }
      
      if (this.modalMod) {
        // this.mapaMedidorService.modificar(medidor.coordenadas);
      }

      if (this.modalView) {
        this.mapaMedidorService.mostrarMedidor(this.medidor);
      }

      this.mapaMedidorService.coords.subscribe((res) => {
        this.coordenada.latitud = res.latitud;
        this.coordenada.longitud = res.longitud;
      });
    });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      id_med: [''],
      tipo_med: ['', [Validators.required]],
      estado: [''],
      cliente: ['', [Validators.required]],
      id_coor: [''],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      id_med: [''],
      tipo_med: ['', [Validators.required]],
      estado: [''],
      cliente: ['', [Validators.required]],
      id_coor: [''],
    });
  }

  adicionar() {
    this.submittedAdd = true;

    if (this.Add.valid) {
      this.coordenadasService.adicionar(this.coordenada).subscribe(
        (res) => {
          this.medidor.tipo_med = this.Add.get('tipo_med')?.value;
          this.medidor.id_cli = this.Add.get('cliente')?.value.id_cli;
          this.medidor.id_coor = res;

          this.medidoresService.adicionar(this.medidor).subscribe((res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Medidor adicionado',
              life: 5000,
            });
            this.modalAdd = false;
            this.listar();
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al adicionar medidor',
            life: 5000,
          });
          this.modalAdd = false;
        }
      );
    } else {
      this.Add.markAllAsTouched();
    }
  }

  modificar() {
    this.submittedMod = true;

    if (this.Mod.valid) {
      this.coordenadasService.modificar(this.coordenada).subscribe((res) => {
        this.medidor.id_med = this.Mod.get('id_med')?.value;
        this.medidor.tipo_med = this.Mod.get('tipo_med')?.value;
        this.medidor.id_cli = this.Mod.get('id_cli')?.value;
        this.medidor.id_coor = this.Mod.get('id_coor')?.value;

        console.log(this.medidor);

        this.medidoresService.modificar(this.medidor).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exitoso',
            detail: 'Medidor modificado',
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
    this.medidoresService.habilitar(this.id_med).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Medidor habilitado',
        life: 5000,
      });
      this.modalEnable = false;
      this.listar();
    });
  }

  deshabilitar() {
    this.medidoresService.deshabilitar(this.id_med).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Medidor deshabilitado',
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

  modalModificar(medidor: Medidores) {
    this.id_med = medidor.id_med;
    this.id_coor = medidor.coordenadas.id_coor;
    this.mapaMedidorService.modificar(medidor.coordenadas);

    this.modalMod = true;
    this.Mod.patchValue({
      id_med: medidor.id_med,
      tipo_med: medidor.tipo_med,
      id_cli: medidor.id_cli,
      id_coor: medidor.id_coor,
    });
    this.submittedMod = false;
  }

  modalHabilitar(medidor: Medidores) {
    this.id_med = medidor.id_med;
    this.itemSelected = this.transformRequestType(medidor.tipo_med).translation;
    this.modalEnable = true;
  }

  modalDeshabilitar(medidor: Medidores) {
    this.id_med = medidor.id_med;
    this.itemSelected = this.transformRequestType(medidor.tipo_med).translation;
    this.modalDisable = true;
  }

  modalVisualizar(medidor: Medidores) {
    this.id_med = medidor.id_med;
    this.itemSelected = medidor.tipo_med;
    this.modalView = true;
    this.medidor = medidor;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  buscarLugar(event: any) {
    const query = event.query;
    this.lugaresService.listar().subscribe((res: Lugares[]) => {
      this.lugares = res.filter((lugar: Lugares) =>
        lugar.nombre.toLowerCase().includes(query.toLowerCase())
      );
    });
  }

  seleccionarLugar(lugar: Lugares): void {
    this.mapaMedidorService.mostrarLugar(lugar);
  }

  buscarClientes(event: any) {
    const query = event.query.toLowerCase();

    // Filtra los clientes que coincidan con el CI o el nombre
    this.filteredClientes = this.clientes.filter((cliente) => {
      const ci = cliente.personas.ci.toLowerCase();
      const fullName = `${cliente.personas.nombre} ${cliente.personas.ap} ${
        cliente.personas.am || ''
      }`.toLowerCase();

      return ci.includes(query) || fullName.includes(query);
    });

    // Mapea los resultados para mostrar el nombre completo en el campo
    this.filteredClientes = this.filteredClientes.map((cliente) => ({
      ...cliente,
      fullname: `${cliente.personas.nombre} ${cliente.personas.ap} ${
        cliente.personas.am || ''
      }`,
    }));
  }

  ciNoExisteValidator(control: AbstractControl) {
    const ci = control.value;

    const clienteExistente = this.clientes.some((cliente) =>
      cliente.personas.ci.startsWith(ci)
    );

    return clienteExistente ? null : { noExiste: true };
  }

  clienteSeleccionadoValidator(control: AbstractControl) {
    const clienteSeleccionado = control.value;
    if (!clienteSeleccionado) {
      return {
        clienteNoSeleccionado: true,
      };
    }
    return null;
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

  cambiarCapa() {
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
