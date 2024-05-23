import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Table } from 'primeng/table';
import { catchError, map } from 'rxjs';
import { Cargos } from 'src/app/api/models/cargos/cargos';
import { Empleados } from 'src/app/api/models/empleados/empleados';
import { Personas } from 'src/app/api/models/personas/personas';
import { Usuarios } from 'src/app/api/models/usuarios/usuarios';
import { CargosService } from 'src/app/api/services/cargos/cargos.service';
import { EmpleadosService } from 'src/app/api/services/empleados/empleados.service';
import { ImagenesService } from 'src/app/api/services/imagenes/imagenes.service';
import { PersonasService } from 'src/app/api/services/personas/personas.service';
import { UsuariosService } from 'src/app/api/services/usuarios/usuarios.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss'],
  providers: [MessageService],
})
export class EmpleadosComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  empleado = new Empleados();
  persona = new Personas();
  usuario = new Usuarios();

  empleados: Empleados[] = [];
  cargos: Cargos[] = [];

  Add!: FormGroup;
  submittedAdd = false;
  Mod!: FormGroup;
  submittedMod = false;
  Enable!: FormGroup;
  submittedEnable = false;
  Disable!: FormGroup;
  submittedDisable = false;
  Res!: FormGroup;
  submittedRes = false;
  AddU!: FormGroup;
  submittedAddU = false;
  ModU!: FormGroup;
  submittedModU = false;

  modalAdd: boolean = false;
  modalMod: boolean = false;
  modalDisable: boolean = false;
  modalEnable: boolean = false;
  modalRes: boolean = false;
  modalAddU: boolean = false;
  modalModU: boolean = false;

  itemSelected: string = '';
  id_p: number = 0;
  id_emp: number = 0;
  id_usu: number = 0;
  ci: string = '';

  cols: any[] = [];

  selectedFile!: File;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private empleadosService: EmpleadosService,
    private personasService: PersonasService,
    private cargosService: CargosService,
    private imagenesService: ImagenesService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'n', header: 'N°' },
      { field: 'ci', header: 'CI' },
      { field: 'foto', header: 'Foto' },
      { field: 'personas.nombre', header: 'Nombre' },
      { field: 'personas.ap', header: 'Apellido paterno' },
      { field: 'personas.am', header: 'Apellido materno' },
      { field: 'cargos.nombre', header: 'Cargo' },
      { field: 'estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.listar();
    this.listarCargos();

    this.registerFormAdd();
    this.registerFormMod();
    // this.registerFormRes();
    this.registerFormAddU();
    this.registerFormModU();
  }

  listar(): void {
    this.empleadosService.listar().subscribe((res) => {
      this.empleados = res;
    });
  }

  listarCargos(): void {
    this.cargosService.listar().subscribe((res) => {
      this.cargos = res;
    });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      id_emp: [''],
      email: [
        '',
        [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      ],
      id_car: ['', Validators.required],
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
      id_emp: [''],
      email: [
        '',
        [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      ],
      id_car: ['', Validators.required],
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

  // registerFormRes() {
  //   this.Res = this.formBuilder.group({
  //     id_res: [''],
  //     inicio: ['', Validators.required],
  //     fin: ['', Validators.required],
  //     ci: [''],
  //   });
  // }

  registerFormAddU() {
    this.AddU = this.formBuilder.group({
      id_usu: [''],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required]],
      id_p: [''],
    });
    this.AddU.setValidators(this.passwordMatchValidatorWrapper());
  }

  registerFormModU() {
    this.ModU = this.formBuilder.group({
      id_usu: [''],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required]],
      id_p: [''],
    });
    this.ModU.setValidators(this.passwordMatchValidatorWrapper());
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
                this.empleado.id_emp = this.Add.get('id_emp')?.value;
                this.empleado.email = this.Add.get('email')?.value;
                this.empleado.id_car = this.Add.get('id_car')?.value;
                this.empleado.id_p = res;

                this.empleadosService.adicionar(this.empleado).subscribe(
                  (res) => {
                    // Éxito en la adición de persona y empleado
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Exitoso',
                      detail: 'empleado adicionado',
                      life: 5000,
                    });
                    this.modalAdd = false;
                    this.listar();
                  },
                  (errorEmpleado) => {
                    // Falla la adición del empleado, eliminar persona
                    this.personasService.eliminar(res).subscribe(() => {
                      this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al adicionar el empleado',
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
        // No se seleccionó ninguna imagen, continuar con la adición de persona y empleado
        this.personasService.adicionar(this.persona).subscribe(
          (res) => {
            
            this.empleado.email = this.Add.get('email')?.value;
            this.empleado.id_car = this.Add.get('id_car')?.value;
            this.empleado.id_p = res;

            this.empleadosService.adicionar(this.empleado).subscribe(
              (res) => {
                // Éxito en la adición de persona y empleado
                this.messageService.add({
                  severity: 'success',
                  summary: 'Exitoso',
                  detail: 'Empleado adicionado',
                  life: 5000,
                });
                this.modalAdd = false;
                this.listar();
              },
              (errorEmpleado) => {
                // Falla la adición del empleado, eliminar persona
                this.personasService.eliminar(res).subscribe(() => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al adicionar el empleado',
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
        this.imagenesService.adicionar(this.selectedFile).subscribe(
          (res) => {
            this.persona.id_img = res;

            this.personasService.modificar(this.persona).subscribe(
              (res) => {
                this.empleado.id_emp = this.Mod.get('id_emp')?.value;
                this.empleado.email = this.Mod.get('email')?.value;
                this.empleado.id_car = this.Mod.get('id_car')?.value;
                this.empleado.id_p = this.Mod.get('id_p')?.value;

                this.empleadosService.modificar(this.empleado).subscribe(
                  (res) => {
                    // Éxito en la adición de persona y empleado
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Exitoso',
                      detail: 'empleado modificado',
                      life: 5000,
                    });
                    this.modalMod = false;
                    this.listar();
                  },
                  (errorEmpleado) => {
                    // Falla la adición del empleado, eliminar persona
                    this.personasService.eliminar(res).subscribe(() => {
                      this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al modificar el empleado',
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
            this.empleado.id_emp=this.Mod.get('id_emp')?.value;
            this.empleado.email = this.Mod.get('email')?.value;
            this.empleado.id_car = this.Mod.get('id_car')?.value;
            this.empleado.id_p = this.Mod.get('id_p')?.value;

            this.empleadosService.modificar(this.empleado).subscribe(
              (res) => {
                // Éxito en la adición de persona y empleado
                this.messageService.add({
                  severity: 'success',
                  summary: 'Exitoso',
                  detail: 'Empleado modificado',
                  life: 5000,
                });
                this.modalMod = false;
                this.listar();
              },
              (errorEmpleado) => {
                // Falla la adición del empleado, eliminar persona
                this.personasService.eliminar(res).subscribe(() => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al modificar el empleado',
                    life: 5000,
                  });
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
        detail: 'Empleado habilitado',
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
        detail: 'Empleado deshabilitado',
        life: 5000,
      });
      this.modalDisable = false;
      this.listar();
    });
  }

  asignarResponsable() {
    this.submittedRes = true;
    if (this.Res.valid) {
    } else {
      this.Res.markAllAsTouched();
    }
  }

  adicionarUsuario() {
    this.submittedAddU = true;

    if (this.AddU.valid) {
      this.usuario.username = this.AddU.get('username')?.value;
      this.usuario.password = this.AddU.get('password')?.value;
      this.usuario.id_p = this.id_p;

      this.usuariosService.adicionar(this.usuario).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Usuario adicionado',
          life: 5000,
        });
        this.modalAddU = false;
        this.listar();
      });
    } else {
      this.AddU.markAllAsTouched();
    }
  }

  modificarUsuario() {
    this.submittedModU = true;

    if (this.ModU.valid) {
      this.usuario.id_usu = this.id_usu;
      this.usuario.username = this.ModU.get('username')?.value;
      this.usuario.password = this.ModU.get('password')?.value;
      this.usuario.id_p = this.ModU.get('id_p')?.value;

      this.usuariosService.modificar(this.usuario).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Usuario modificado',
          life: 5000,
        });
        this.modalModU = false;
        this.listar();
      });
    } else {
      this.ModU.markAllAsTouched();
    }
  }

  modalAdicionar() {
    this.modalAdd = true;
    this.Add.reset();
    this.submittedAdd = false;
  }

  modalModificar(empleado: Empleados) {
    console.log(empleado);

    this.id_emp = empleado.id_emp;
    this.id_p = empleado.personas.id_p;
    this.ci = empleado.personas.ci;

    this.modalMod = true;
    this.Mod.patchValue({
      id_p: empleado.personas.id_p,
      id_emp: empleado.id_emp,
      email: empleado.email,
      id_car: empleado.cargos.id_car,
      ci: empleado.personas.ci,
      nombre: empleado.personas.nombre,
      ap: empleado.personas.ap,
      am: empleado.personas.am,
      fecha_nacimiento: this.stringToDate(empleado.personas.fecha_nacimiento),
      telefono: empleado.personas.telefono,
      sexo: empleado.personas.sexo,
      estado_civil: empleado.personas.estado_civil,
      id_img: empleado.personas.id_img,
    });
    this.submittedMod = false;
  }

  modalHabilitar(empleado: Empleados) {
    this.id_p = empleado.personas.id_p;
    this.itemSelected = `${empleado.personas.nombre} ${empleado.personas.ap}${
      empleado.personas.am ? ' ' + empleado.personas.am : ''
    }`;
    this.modalEnable = true;
  }

  modalDeshabilitar(empleado: Empleados) {
    this.id_p = empleado.personas.id_p;
    this.itemSelected = `${empleado.personas.nombre} ${empleado.personas.ap}${
      empleado.personas.am ? ' ' + empleado.personas.am : ''
    }`;
    this.modalDisable = true;
  }

  modalAsignarResponsable(empleado: Empleados) {
    this.itemSelected = `${empleado.personas.nombre} ${empleado.personas.ap}${
      empleado.personas.am ? ' ' + empleado.personas.am : ''
    }`;
    this.modalRes = true;
    this.submittedRes = false;
  }

  modalAdicionarUsuario(empleado: Empleados) {
    this.id_p = empleado.personas.id_p;
    this.AddU.reset();
    this.submittedAddU = false;
    this.modalAddU = true;
  }

  modalModificarUsuario(empleado: Empleados) {
    this.id_usu = empleado.personas.usuarios.id_usu;

    this.ModU.reset({
      id_usu: empleado.personas.usuarios.id_usu,
      username: empleado.personas.usuarios.username,
      password: empleado.personas.usuarios.password,
      id_p: empleado.personas.id_p,
    });
    this.submittedModU = false;
    this.modalModU = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // Para imagenes
  handleUpload(event: any) {
    this.selectedFile = event.files[0];
  }

  // removeFile(file: File, event: any, uploader: FileUpload) {
  //   console.log(uploader);
  //   console.log(event);
  //   console.log(file);
  //   const index = uploader.files.indexOf(file);
  //   uploader.remove(event, index);
  //   // uploader.clear();
  // }

  // DateToString(fecha: Date): string {
  //   const options: Intl.DateTimeFormatOptions = {
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit',
  //   };

  //   return fecha.toLocaleDateString('es-ES', options);
  // }

  // stringToDate(fecha: string) {
  //   const parts = fecha.split('/');
  //   const day = parseInt(parts[0], 10);
  //   const month = parseInt(parts[1], 10) - 1;
  //   const year = parseInt(parts[2], 10);

  //   return new Date(year, month, day);
  // }

  getImagenUrl(imagen: string): string {
    return 'data:image/png;base64,' + imagen;
  }

  // validarSeleccionWrapper(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     return this.ciValidator(control as FormControl);
  //   };
  // }

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

  passwordMatchValidator(control: FormGroup) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (this.AddU.value.password !== this.AddU.value.confirmPassword) {
      this.AddU.get('confirmPassword')?.setErrors({ passwordMatch: true });
    }

    if (this.ModU.value.password !== this.ModU.value.confirmPassword) {
      this.ModU.get('confirmPassword')?.setErrors({ passwordMatch: true });
    }

    return password === confirmPassword ? null : { passwordMatch: true };
  }

  passwordMatchValidatorWrapper(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return this.passwordMatchValidator(control as FormGroup);
    };
  }

  stringToDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
}
