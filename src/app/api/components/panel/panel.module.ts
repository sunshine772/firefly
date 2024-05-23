import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PanelRoutingModule } from './panel-routing.module';
import { ActividadesComponent } from './actividades/actividades.component';
import { AmpliacionesComponent } from './ampliaciones/ampliaciones.component';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { TreeTableModule } from 'primeng/treetable';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { SidebarModule } from 'primeng/sidebar';
import { PanelModule as PanelPrimeModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ImageModule } from 'primeng/image';
import { PickListModule } from 'primeng/picklist';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { AreasComponent } from './areas/areas.component';
import { CallesComponent } from './calles/calles.component';
import { CargosComponent } from './cargos/cargos.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ConsumosComponent } from './consumos/consumos.component';
import { CoordenadasComponent } from './coordenadas/coordenadas.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { FasesComponent } from './fases/fases.component';
import { ImagenesComponent } from './imagenes/imagenes.component';
import { InspectoresComponent } from './inspectores/inspectores.component';
import { InstalacionesComponent } from './instalaciones/instalaciones.component';
import { LecturacionesComponent } from './lecturaciones/lecturaciones.component';
import { LugaresComponent } from './lugares/lugares.component';
import { MedidoresComponent } from './medidores/medidores.component';
import { MenusComponent } from './menus/menus.component';
import { MunicipiosComponent } from './municipios/municipios.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { OperacionesComponent } from './operaciones/operaciones.component';
import { PersonasComponent } from './personas/personas.component';
import { PostesComponent } from './postes/postes.component';
import { ProcesosComponent } from './procesos/procesos.component';
import { ReclamosComponent } from './reclamos/reclamos.component';
import { ResponsablesComponent } from './responsables/responsables.component';
import { RolesComponent } from './roles/roles.component';
import { RutasComponent } from './rutas/rutas.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { SubordinadosComponent } from './subordinados/subordinados.component';
import { TarifasComponent } from './tarifas/tarifas.component';
import { TokensComponent } from './tokens/tokens.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ReportesComponent } from './reportes/reportes.component';
import { MonthYearPipe } from '../../pipes/MonthYear/month-year.pipe';
import { CapitalizePipe } from '../../pipes/capitalize/capitalize.pipe';
import { PublicadoPipe } from '../../pipes/publicado/publicado.pipe';
import { KwhPipe } from '../../pipes/kwh.pipe';
import { SolicitadoPipe } from '../../pipes/solicitado/solicitado.pipe';
import { AprobadaPipe } from '../../pipes/aprobada/aprobada.pipe';

@NgModule({
  declarations: [
    ActividadesComponent,
    AmpliacionesComponent,
    AreasComponent,
    CallesComponent,
    CargosComponent,
    ClientesComponent,
    ConsumosComponent,
    CoordenadasComponent,
    DocumentosComponent,
    EmpleadosComponent,
    FasesComponent,
    ImagenesComponent,
    InspectoresComponent,
    InstalacionesComponent,
    LecturacionesComponent,
    LugaresComponent,
    MedidoresComponent,
    MenusComponent,
    MunicipiosComponent,
    NoticiasComponent,
    OperacionesComponent,
    PersonasComponent,
    PostesComponent,
    ProcesosComponent,
    ReclamosComponent,
    ResponsablesComponent,
    RolesComponent,
    RutasComponent,
    SolicitudesComponent,
    SubordinadosComponent,
    TarifasComponent,
    TokensComponent,
    UsuariosComponent,
    ReportesComponent,

    //pipes
    MonthYearPipe,
    CapitalizePipe,
    PublicadoPipe,
    SolicitadoPipe,
    KwhPipe,
    AprobadaPipe

  ],
  imports: [
    CommonModule,
    PanelRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    AutoCompleteModule,
    TagModule,
    StepsModule,
    TabViewModule,
    CalendarModule,
    TreeTableModule,
    ChipModule,
    ChipsModule,
    SidebarModule,
    PanelPrimeModule,
    CheckboxModule,
    ToggleButtonModule,
    ImageModule,
    PickListModule,
    OverlayPanelModule,
    
    NgxExtendedPdfViewerModule,
  ],
})
export class PanelModule {}
