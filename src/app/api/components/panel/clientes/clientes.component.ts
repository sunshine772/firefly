import { ChangeDetectorRef, Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { map } from 'rxjs';
import { Clientes } from 'src/app/api/models/clientes/clientes';
import { Coordenadas } from 'src/app/api/models/coordenadas/coordenadas';
import { Lugares } from 'src/app/api/models/lugares/lugares';
import { Medidores } from 'src/app/api/models/medidores/medidores';
import { Personas } from 'src/app/api/models/personas/personas';
import { Usuarios } from 'src/app/api/models/usuarios/usuarios';
import { ClientesService } from 'src/app/api/services/clientes/clientes.service';
import { CoordenadasService } from 'src/app/api/services/coordenadas/coordenadas.service';
import { ImagenesService } from 'src/app/api/services/imagenes/imagenes.service';
import { LugaresService } from 'src/app/api/services/lugares/lugares.service';
import { MapaMedidorService } from 'src/app/api/services/medidores/mapa-medidor/mapa-medidor.service';
import { MedidoresService } from 'src/app/api/services/medidores/medidores.service';
import { PersonasService } from 'src/app/api/services/personas/personas.service';
import { UsuariosService } from 'src/app/api/services/usuarios/usuarios.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  providers: [MessageService],
})
export class ClientesComponent {
  cliente = new Clientes();
  persona = new Personas();
  usuario = new Usuarios();
  medidor = new Medidores();
  coordenada = new Coordenadas();

  clientes: Clientes[] = [];
  medidores: Medidores[] = [];
  lugares: Lugares[] = [];

  Add!: FormGroup;
  submittedAdd = false;
  Mod!: FormGroup;
  submittedMod = false;
  Enable!: FormGroup;
  submittedEnable = false;
  Disable!: FormGroup;
  submittedDisable = false;
  AddM!: FormGroup;
  submittedAddM = false;
  ModM!: FormGroup;
  submittedModM = false;

  modalAdd: boolean = false;
  modalMod: boolean = false;
  modalDisable: boolean = false;
  modalEnable: boolean = false;
  modalAddM: boolean = false;
  modalModM: boolean = false;
  modalEnableM: boolean = false;
  modalDisableM: boolean = false;
  modalView: boolean = false;

  ubicacionSeleccionada: boolean = false;

  itemSelected: string = '';
  id_p: number = 0;
  id_coor: number = 0;
  id_med: number = 0;
  id_cli: number = 0;
  ci: string = '';

  cols: any[] = [];
  colsMedidores: any[] = [];
  tipo_medidor: any[] = [];

  selectedFile!: File;

  checked: boolean = false;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private personasService: PersonasService,
    private clientesService: ClientesService,
    private usuariosService: UsuariosService,
    private imagenesService: ImagenesService,
    private medidoresService: MedidoresService,
    private coordenadasService: CoordenadasService,
    private lugaresService: LugaresService,
    private mapaMedidorService: MapaMedidorService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'n', header: '' },
      { field: 'n', header: 'N°' },
      { field: 'foto', header: 'Foto' },
      { field: 'personas.ci', header: 'CI' },
      { field: 'personas.nombre', header: 'Nombre' },
      { field: 'personas.ap', header: 'Primer apellido' },
      { field: 'personas.am', header: 'Segundo apellido' },
      { field: 'personas.estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.colsMedidores = [
      { field: 'n', header: 'N°' },
      { field: 'medidores.tipo_med', header: 'Tipo de medidor' },
      { field: 'medidores.estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.tipo_medidor = [
      { tipo_med: 'D', nombre: 'Domiciliario' },
      { tipo_med: 'G', nombre: 'General' },
      { tipo_med: 'I', nombre: 'Industrial' },
    ];

    this.listar();
    this.listarLugares();

    this.registerFormAdd();
    this.registerFormMod();
    this.registerFormAddM();
    this.registerFormModM();
  }

  listar(): void {
    this.clientesService.listar().subscribe((res) => {
      this.clientes = res;
      console.log(res);
    });
  }

  listarMedidores(id_cli: number) {
    this.id_cli = id_cli;
    this.medidoresService.listarMedidorCliente(this.id_cli).subscribe((res) => {
      this.medidores = res;
      console.log(res);
    });
  }

  listarLugares() {
    this.lugaresService.listar().subscribe((res) => {
      this.lugares = res;
    });
  }

  mostrarMapa() {
    this.mapaMedidorService
      .buildMap()
      .then((data) => {
        if (this.modalView) {
          this.mapaMedidorService.mostrarMedidor(this.medidor);
        }
        if (this.modalAddM || this.modalModM) {
          this.mapaMedidorService.adicionar();
          this.mapaMedidorService.coords.subscribe((res) => {
            this.coordenada.latitud = res.latitud;
            this.coordenada.longitud = res.longitud;
            if (this.coordenada.latitud && this.coordenada.longitud) {
              this.AddM.get('id_coor')?.setErrors(null);
            } else {
              this.AddM.get('id_coor')?.setErrors({ required: true });
            }
          });
        }
      })
      .catch((error) => {
        console.log('error ', error);
      });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      id_cli: [''],
      id_p: [''],
      ci: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10),
          Validators.pattern('^[0-9a-zA-Z]+$'),
        ],
        [this.ciValidator.bind(this)],
      ],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      ap: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      am: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      fecha_nacimiento: ['', Validators.required],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(8),
          Validators.maxLength(8),
        ],
      ],
      sexo: ['', Validators.required],
      estado_civil: ['', Validators.required],
      id_img: [''],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      id_cli: [''],
      id_p: [''],
      ci: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10),
          Validators.pattern('^[0-9a-zA-Z]+$'),
        ],
        [this.ciValidator.bind(this)],
      ],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      ap: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      am: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      fecha_nacimiento: ['', Validators.required],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(8),
          Validators.maxLength(8),
        ],
      ],
      sexo: ['', Validators.required],
      estado_civil: ['', Validators.required],
      id_img: [''],
    });
  }

  registerFormAddM() {
    this.AddM = this.formBuilder.group({
      tipo_med: ['', Validators.required],
      id_coor: [''],
      ci: [''],
    });
  }

  registerFormModM() {
    this.ModM = this.formBuilder.group({
      tipo_med: ['', Validators.required],
      id_coor: [''],
      ci: [''],
    });
  }

  adicionar() {
    this.submittedAdd = true;

    if (this.Add.valid) {
      this.persona.ci = this.Add.get('ci')?.value.toUpperCase();
      this.persona.nombre = this.Add.get('nombre')?.value.toUpperCase();
      this.persona.ap = this.Add.get('ap')?.value.toUpperCase();
      this.persona.am = this.Add.get('am')?.value
        ? this.Add.get('am')?.value.toUpperCase()
        : null;
      this.persona.fecha_nacimiento = this.Add.get('fecha_nacimiento')?.value;
      this.persona.telefono = this.Add.get('telefono')?.value;
      this.persona.sexo = this.Add.get('sexo')?.value;
      this.persona.estado_civil = this.Add.get('estado_civil')?.value;

      if (this.selectedFile) {
        this.imagenesService.adicionar(this.selectedFile).subscribe(
          (res) => {
            this.persona.id_img = res;

            this.personasService.adicionar(this.persona).subscribe(
              (res) => {
                this.cliente.id_p = res;
                this.cliente.tercera_edad = this.calcularTerceraEdad(
                  this.Add.get('fecha_nacimiento')?.value
                );
                this.usuario.id_p = res;

                this.clientesService.adicionar(this.cliente).subscribe(
                  async (res) => {
                    this.usuario.username = await this.generateUsername(
                      this.persona
                    );

                    this.usuariosService
                      .adicionar(this.usuario)
                      .subscribe((res) => {
                        // Éxito en la adición de persona, cliente y usuario
                        this.messageService.add({
                          severity: 'success',
                          summary: 'Exitoso',
                          detail: 'Cliente adicionado',
                          life: 5000,
                        });
                        this.modalAdd = false;
                        this.listar();
                      });
                  },
                  (errorCliente) => {
                    // Falla la adición del cliente, eliminar persona
                    this.personasService.eliminar(res).subscribe(() => {
                      this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al adicionar el cliente',
                        life: 5000,
                      });
                      this.modalAdd = false;
                      this.listar();
                    });
                  }
                );
              },
              (errorPersona) => {
                // Falla la adición de la persona, eliminar imagen
                this.imagenesService.eliminar(res).subscribe(() => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al adicionar la persona',
                    life: 5000,
                  });
                });
                this.modalAdd = false;
                this.listar();
              }
            );
          },
          (errorImagen) => {
            // Falla la subida de la imagen
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al subir la imagen',
              life: 5000,
            });
            this.modalAdd = false;
            this.listar();
          }
        );
      } else {
        // No se seleccionó ninguna imagen, continuar con la adición de persona y cliente
        this.personasService.adicionar(this.persona).subscribe(
          (res) => {
            this.cliente.id_p = res;
            this.cliente.tercera_edad = this.calcularTerceraEdad(
              this.Add.get('fecha_nacimiento')?.value
            );
            this.usuario.id_p = res;

            console.log(this.cliente);

            this.clientesService.adicionar(this.cliente).subscribe(
              async (res) => {
                this.usuario.username = await this.generateUsername(
                  this.persona
                );

                this.usuariosService
                  .adicionar(this.usuario)
                  .subscribe((res) => {
                    // Éxito en la adición de persona, cliente y usuario
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Exitoso',
                      detail: 'Cliente adicionado',
                      life: 5000,
                    });
                    this.modalAdd = false;
                    this.listar();
                  });
              },
              (errorCliente) => {
                // Falla la adición del cliente, eliminar persona
                this.personasService.eliminar(res).subscribe(() => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al adicionar el cliente',
                    life: 5000,
                  });
                });
                this.modalAdd = false;
                this.listar();
              }
            );
          },
          (errorPersona) => {
            // Falla la adición de la persona
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al adicionar la persona',
              life: 5000,
            });
            this.modalAdd = false;
            this.listar();
          }
        );
      }
    } else {
      this.Add.markAllAsTouched();
    }
  }

  modificar() {
    this.submittedMod = true;

    if (this.Mod.valid) {
      this.persona.id_p = this.Mod.get('id_p')?.value;
      this.persona.ci = this.Mod.get('ci')?.value.toUpperCase();
      this.persona.nombre = this.Mod.get('nombre')?.value.toUpperCase();
      this.persona.ap = this.Mod.get('ap')?.value.toUpperCase();
      this.persona.am = this.Mod.get('am')?.value
        ? this.Mod.get('am')?.value.toUpperCase()
        : null;
      this.persona.fecha_nacimiento = this.Mod.get('fecha_nacimiento')?.value;
      this.persona.telefono = this.Mod.get('telefono')?.value;
      this.persona.sexo = this.Mod.get('sexo')?.value;
      this.persona.estado_civil = this.Mod.get('estado_civil')?.value;

      if (this.selectedFile) {
        const formData: FormData = new FormData();
        formData.append('id_img', this.Mod.get('id_img')?.value.toString());
        formData.append('imagen', this.selectedFile);
        this.imagenesService.modificar(formData).subscribe(
          (res) => {
            this.persona.id_img = this.Mod.get('id_img')?.value;

            this.personasService.modificar(this.persona).subscribe(
              (res) => {
                this.cliente.id_p = res;
                this.cliente.tercera_edad = this.calcularTerceraEdad(
                  this.Mod.get('fecha_nacimiento')?.value
                );
                this.usuario.id_p = res;

                this.clientesService.modificar(this.cliente).subscribe(
                  async (res) => {
                    // Éxito en la adición de persona, cliente y usuario
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Exitoso',
                      detail: 'Cliente modificado',
                      life: 5000,
                    });
                    this.modalMod = false;
                    this.listar();
                  },
                  (errorCliente) => {
                    // Falla la adición del cliente, eliminar persona
                    this.personasService.eliminar(res).subscribe(() => {
                      this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al modificar el cliente',
                        life: 5000,
                      });
                      this.modalMod = false;
                      this.listar();
                    });
                  }
                );
              },
              (errorPersona) => {
                // Falla la adición de la persona, eliminar imagen
                this.imagenesService.eliminar(res).subscribe(() => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al modificar la persona',
                    life: 5000,
                  });
                });
                this.modalMod = false;
                this.listar();
              }
            );
          },
          (errorImagen) => {
            // Falla la subida de la imagen
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al subir la imagen',
              life: 5000,
            });
            this.modalMod = false;
            this.listar();
          }
        );
      } else {
        this.persona.id_img = this.Mod.get('id_img')?.value;

        this.personasService.modificar(this.persona).subscribe(
          (res) => {
            this.cliente.id_cli = this.Mod.get('id_cli')?.value;
            this.cliente.id_p = this.Mod.get('id_p')?.value;
            this.cliente.tercera_edad = this.calcularTerceraEdad(
              this.Mod.get('fecha_nacimiento')?.value
            );
            console.log(this.cliente);

            this.clientesService.modificar(this.cliente).subscribe(
              async (res) => {
                // Éxito en la adición de persona, cliente y usuario
                this.messageService.add({
                  severity: 'success',
                  summary: 'Exitoso',
                  detail: 'Cliente modificado',
                  life: 5000,
                });
                this.modalMod = false;
                this.listar();
              },
              (errorCliente) => {
                // Falla la adición del cliente, eliminar persona
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Error al modificar el cliente',
                  life: 5000,
                });
                this.modalMod = false;
                this.listar();
              }
            );
          },
          (errorPersona) => {
            // Falla la adición de la persona
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al modificar la persona',
              life: 5000,
            });
            this.modalMod = false;
            this.listar();
          }
        );
      }
    } else {
      this.Mod.markAllAsTouched();
    }
  }

  habilitar() {
    this.personasService.habilitar(this.id_p).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Cliente habilitado',
        life: 5000,
      });
      this.modalEnable = false;
      this.listar();
    });
  }

  deshabilitar() {
    this.personasService.deshabilitar(this.id_p).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Cliente deshabilitado',
        life: 5000,
      });
      this.modalDisable = false;
      this.listar();
    });
  }

  adicionarMedidor() {
    this.submittedAddM = true;

    if (this.AddM.valid) {
      this.coordenadasService.adicionar(this.coordenada).subscribe((res) => {
        this.medidor.tipo_med = this.AddM.get('tipo_med')?.value;
        this.medidor.id_cli = this.id_cli;
        this.medidor.id_coor = res;

        this.medidoresService.adicionar(this.medidor).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exitoso',
            detail: 'Medidor adicionado',
            life: 5000,
          });
          this.modalAddM = false;
          this.listarMedidores(this.id_cli);
        });
      });
    } else {
      this.AddM.markAllAsTouched();
    }
  }

  modificarMedidor() {
    this.submittedModM = true;
    if (this.ModM.valid) {
      this.coordenada.id_coor = this.ModM.get('id_coor')?.value;

      this.coordenadasService.modificar(this.coordenada).subscribe((res) => {
        this.medidor.id_med = this.id_med;
        this.medidor.tipo_med = this.ModM.get('tipo_med')?.value;
        this.medidor.id_cli = this.id_cli;
        this.medidor.id_coor = this.ModM.get('id_coor')?.value;

        this.medidoresService.modificar(this.medidor).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exitoso',
            detail: 'Medidor modificado',
            life: 5000,
          });
          this.modalModM = false;
          this.listarMedidores(this.medidor.id_cli);
        });
      });
    } else {
      this.ModM.markAllAsTouched();
    }
  }

  habilitarMedidor() {
    this.medidoresService.habilitar(this.id_med).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Medidor habilitado',
        life: 5000,
      });
      this.modalEnableM = false;
      this.listarMedidores(this.id_cli);
    });
  }

  deshabilitarMedidor() {
    this.medidoresService.deshabilitar(this.id_med).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Medidor deshabilitado',
        life: 5000,
      });
      this.modalDisableM = false;
      this.listarMedidores(this.id_cli);
    });
  }

  modalAdicionar() {
    this.selectedFile;
    this.modalAdd = true;
    this.Add.reset();
    this.submittedAdd = false;
  }

  modalModificar(cliente: Clientes) {
    this.selectedFile;
    this.id_cli = cliente.id_cli;
    this.id_p = cliente.personas.id_p;
    this.ci = cliente.personas.ci;

    this.modalMod = true;
    this.Mod.patchValue({
      id_cli: cliente.id_cli,
      id_p: cliente.personas.id_p,
      ci: cliente.personas.ci,
      nombre: cliente.personas.nombre,
      ap: cliente.personas.ap,
      am: cliente.personas.am,
      fecha_nacimiento: this.stringToDate(cliente.personas.fecha_nacimiento),
      telefono: cliente.personas.telefono,
      sexo: cliente.personas.sexo,
      estado_civil: cliente.personas.estado_civil,
      id_img: cliente.personas.id_img,
    });
    this.submittedMod = false;
  }

  modalHabilitar(cliente: Clientes) {
    this.id_p = cliente.personas.id_p;
    this.itemSelected = `${cliente.personas.nombre} ${cliente.personas.ap}${
      cliente.personas.am ? ' ' + cliente.personas.am : ''
    }`;
    this.modalEnable = true;
  }

  modalDeshabilitar(cliente: Clientes) {
    this.id_p = cliente.personas.id_p;
    this.itemSelected = `${cliente.personas.nombre} ${cliente.personas.ap}${
      cliente.personas.am ? ' ' + cliente.personas.am : ''
    }`;
    this.modalDisable = true;
  }

  modalAdicionarMedidor(cliente: Clientes) {
    this.id_cli = cliente.id_cli;
    this.modalAddM = true;
    this.AddM.reset();
    this.submittedAddM = false;
  }

  modalModificarMedidor(medidor: Medidores) {
    this.id_med = medidor.id_med;
    this.modalModM = true;
    this.ModM.patchValue({
      tipo_med: medidor.tipo_med,
      id_coor: medidor.coordenadas.id_coor,
    });
    this.submittedModM = false;
  }

  modalHabilitarMedidor(medidor: Medidores) {
    this.id_med = medidor.id_med;
    this.itemSelected = this.transformRequestType(medidor.tipo_med).translation;
    this.modalEnableM = true;
  }

  modalDeshabilitarMedidor(medidor: Medidores) {
    this.id_med = medidor.id_med;
    this.itemSelected = this.transformRequestType(medidor.tipo_med).translation;
    this.modalDisableM = true;
  }

  modalVisualizarMedidor(medidor: Medidores) {
    this.id_med = medidor.id_med;
    this.itemSelected = this.transformRequestType(medidor.tipo_med).translation;
    this.modalView = true;
    this.medidor = medidor;
  }
  // Para ampliar el mapa de la ventana
  maximized: boolean = false;

  resizeMap(): void {
    if (this.modalView) {
      this.maximized = !this.maximized;
      this.mapaMedidorService.buildMap();
    } else {
      this.maximized = !this.maximized;
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  stringToDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
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
    this.mapaMedidorService.mostrarLugar(lugar);
  }

  // Para imagenes
  handleUpload(event: any) {
    this.selectedFile = event.files[0];
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

  getImagenUrl(imagen: string): string {
    return 'data:image/png;base64,' + imagen;
  }

  async generateUsername(persona: Personas): Promise<string> {
    const baseUsername = (persona.nombre.charAt(0) + persona.ap).toLowerCase();
    let username = baseUsername;
    let counter = 1;

    let existe = await this.usuariosService.existe(username).toPromise();

    while (existe) {
      username = baseUsername + counter;
      counter++;
      existe = await this.usuariosService.existe(username).toPromise();
    }

    return username;
  }

  calcularTerceraEdad(fechaNacimiento: string | Date): boolean {
    if (typeof fechaNacimiento === 'string') {
      fechaNacimiento = new Date(fechaNacimiento);
    }

    if (
      !(fechaNacimiento instanceof Date) ||
      isNaN(fechaNacimiento.getTime())
    ) {
      return false;
    }

    const ahora = new Date();
    const edad = ahora.getFullYear() - fechaNacimiento.getFullYear();

    return edad >= 60;
  }

  ciValidator(control: AbstractControl) {
    const ci = control.value;

    if (ci === this.ci) {
      return Promise.resolve(null);
    }

    return this.personasService.existe(ci).pipe(
      map((exists) => {
        return exists ? { ciExists: true } : null;
      })
    );
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
