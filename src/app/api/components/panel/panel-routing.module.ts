import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AmpliacionesComponent } from './ampliaciones/ampliaciones.component';
import { ActividadesComponent } from './actividades/actividades.component';
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
import { MapaComponent } from '../mapa/mapa.component';

const routes: Routes = [
  { path: 'actividades', component: ActividadesComponent },
  { path: 'ampliaciones', component: AmpliacionesComponent },
  { path: 'areas', component: AreasComponent },
  { path: 'calles', component: CallesComponent },
  { path: 'cargos', component: CargosComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'consumos', component: ConsumosComponent },
  { path: 'coordenadas', component: CoordenadasComponent },
  { path: 'documentos', component: DocumentosComponent },
  { path: 'empleados', component: EmpleadosComponent },
  { path: 'fases', component: FasesComponent },
  { path: 'imagenes', component: ImagenesComponent },
  { path: 'inspectores', component: InspectoresComponent },
  { path: 'instalaciones', component: InstalacionesComponent },
  { path: 'lecturaciones', component: LecturacionesComponent },
  { path: 'lugares', component: LugaresComponent },
  { path: 'medidores', component: MedidoresComponent },
  { path: 'menus', component: MenusComponent },
  { path: 'municipios', component: MunicipiosComponent },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'operaciones', component: OperacionesComponent },
  { path: 'personas', component: PersonasComponent },
  { path: 'postes', component: PostesComponent },
  { path: 'procesos', component: ProcesosComponent },
  { path: 'reclamos', component: ReclamosComponent },
  { path: 'reportes', component: ReportesComponent },
  { path: 'responsables', component: ResponsablesComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'rutas', component: RutasComponent },
  { path: 'solicitudes', component: SolicitudesComponent },
  { path: 'subordinados', component: SubordinadosComponent },
  { path: 'tarifas', component: TarifasComponent },
  { path: 'tokens', component: TokensComponent },
  { path: 'usuarios', component: UsuariosComponent },

  { path: 'mapa', component: MapaComponent },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
