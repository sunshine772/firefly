import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Noticias } from 'src/app/api/models/noticias/noticias';
import { CookieService } from 'src/app/api/services/cookie/cookie.service';
import { ImagenesService } from 'src/app/api/services/imagenes/imagenes.service';
import { NoticiasService } from 'src/app/api/services/noticias/noticias.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss'],
  providers: [MessageService],
})
export class NoticiasComponent {
  noticia = new Noticias();
  noticias: Noticias[] = [];

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
  id_not: number = 0;
  id_img: number = 0;

  cols: any[] = [];

  imageUrl!: string;
  selectedFile!: File;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private noticiasService: NoticiasService,
    private imagenesService: ImagenesService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'n', header: 'N°' },
      { field: 'imagen', header: 'Imagen' },
      { field: 'titulo', header: 'Título' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'estado', header: 'Estado' },
      { field: 'opciones', header: 'Opciones' },
    ];

    this.listar();

    this.registerFormAdd();
    this.registerFormMod();
  }

  listar(): void {
    this.noticiasService.listar().subscribe((res) => {
      console.log(res);

      this.noticias = res;
    });
  }

  registerFormAdd() {
    this.Add = this.formBuilder.group({
      id_not: [''],
      titulo: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      descripcion: ['', [Validators.minLength(3), Validators.maxLength(500)]],
      id_img: [''],
    });
  }

  registerFormMod() {
    this.Mod = this.formBuilder.group({
      id_not: [''],
      titulo: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      descripcion: ['', [Validators.minLength(3), Validators.maxLength(500)]],
      id_img: [''],
    });
  }

  adicionar() {
    this.submittedAdd = true;
    const usuario = this.cookieService.getCookie('usuario')
      ? JSON.parse(this.cookieService.getCookie('usuario'))
      : null;

    if (this.Add.valid) {
      this.noticia.titulo = this.Add.get('titulo')?.value.toUpperCase();
      this.noticia.descripcion = this.Add.get('descripcion')?.value
        ? this.Add.get('descripcion')?.value
        : null;
      this.noticia.id_usu = usuario.id_usu;

      if (this.selectedFile) {
        this.imagenesService.adicionar(this.selectedFile).subscribe((res) => {
          this.noticia.id_img = res;

          this.noticiasService.adicionar(this.noticia).subscribe((res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Noticia adicionada',
              life: 5000,
            });
            this.modalAdd = false;
            this.listar();
          });
        });
      } else {
        this.noticiasService.adicionar(this.noticia).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exitoso',
            detail: 'Noticia adicionada',
            life: 5000,
          });
          this.modalAdd = false;
          this.listar();
        });
      }
    } else {
      this.Add.markAllAsTouched();
    }
  }

  modificar() {
    this.submittedMod = true;
    const usuario = this.cookieService.getCookie('usuario')
      ? JSON.parse(this.cookieService.getCookie('usuario'))
      : null;

    if (this.Mod.valid) {
      this.noticia.id_not = this.Mod.get('id_not')?.value;
      this.noticia.titulo = this.Mod.get('titulo')?.value.toUpperCase();
      this.noticia.descripcion = this.Mod.get('descripcion')?.value
        ? this.Mod.get('descripcion')?.value
        : null;
      this.noticia.id_usu = usuario.id_usu;

      if (this.selectedFile) {
        // const formData: FormData = new FormData();
        // formData.append('id_img', this.id_img.toString());
        // formData.append('imagen', this.selectedFile);

        this.imagenesService.adicionar(this.selectedFile).subscribe((res) => {
          this.noticia.id_img = res;

          this.noticiasService.modificar(this.noticia).subscribe((res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Noticia modificada',
              life: 5000,
            });
            this.modalMod = false;
            this.listar();
          });
        });
      } else {
        this.noticia.id_img = this.Mod.get('id_img')?.value;

        this.noticiasService.modificar(this.noticia).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exitoso',
            detail: 'Noticia modificada',
            life: 5000,
          });
          this.modalMod = false;
          this.listar();
        });
      }
    } else {
      this.Mod.markAllAsTouched();
    }
  }

  habilitar() {
    this.noticiasService.habilitar(this.id_not).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Noticia habilitada',
        life: 5000,
      });
      this.modalEnable = false;
      this.listar();
    });
  }

  deshabilitar() {
    this.noticiasService.deshabilitar(this.id_not).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Noticia deshabilitada',
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

  modalModificar(noticia: Noticias) {
    this.id_not = noticia.id_not;
    this.id_img = noticia.imagenes.id_img;

    this.modalMod = true;
    this.Mod.get('id_img')?.reset();
    this.Mod.patchValue({
      id_not: noticia.id_not,
      titulo: noticia.titulo,
      descripcion: noticia.descripcion,
      fecha: noticia.fecha,
      hora: noticia.hora,
      id_img: noticia.id_img,
    });
    this.submittedMod = false;
  }

  modalHabilitar(noticia: Noticias) {
    this.id_not = noticia.id_not;
    this.itemSelected = noticia.titulo;
    this.modalEnable = true;
  }

  modalDeshabilitar(noticia: Noticias) {
    this.id_not = noticia.id_not;
    this.itemSelected = noticia.titulo;
    this.modalDisable = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getImagenUrl(imagen: string): string {
    return 'data:image/png;base64,' + imagen;
  }

  handleUpload(event: any) {
    this.selectedFile = event.files[0];
    this.Mod.get('id_img')?.setValue(this.selectedFile);
  }
}
