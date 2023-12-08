import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from './dashboard.component';
import { InicioComponent } from './inicio/inicio.component';
import { ClientesComponent } from './clientes/clientes.component';
import { InformeGeneralComponent } from './informe-general/informe-general.component';
import { InformeRutasComponent } from './informe-rutas/informe-rutas.component';
import { PrestamosComponent } from './prestamos/prestamos.component';
import { RegistroActividadComponent } from './registro-actividad/registro-actividad.component';
import { RenovacionesComponent } from './renovaciones/renovaciones.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { TabuladorComponent } from './tabulador/tabulador.component';
import { AgregarClienteComponent } from './clientes/agregar-cliente/agregar-cliente.component';
import { ExpedienteComponent } from './expediente/expediente.component';
import { EditarClienteComponent } from './clientes/editar-cliente/editar-cliente.component';
import { NuevaRenovacionComponent } from './renovaciones/nueva-renovacion/nueva-renovacion.component';
import { RevisaRenovacionComponent } from './renovaciones/revisa-renovacion/revisa-renovacion.component';
import { NuevaSolicitudComponent } from './solicitudes/nueva-solicitud/nueva-solicitud.component';
import { HistorialRenovacionesComponent } from './renovaciones/historial-renovaciones/historial-renovaciones.component';
import { HistorialSolicitudesComponent } from './solicitudes/historial-solicitudes/historial-solicitudes.component';
import { HistorialPrestamoComponent } from './prestamos/historial-prestamo/historial-prestamo.component';
import { RevisarPrestamoComponent } from './prestamos/revisar-prestamo/revisar-prestamo.component';
import { RegistroPagoComponent } from './prestamos/registro-pago/registro-pago.component';
import { GestionGestoresComponent } from './gestion-gestores/gestion-gestores.component';
import { AjustesComponent } from './ajustes/ajustes.component';

const routes: Routes = [
  {path: '', component: DashboardComponent, children: [
    {path: '', component: InicioComponent},
    {path: 'clientes', component: ClientesComponent},
    {path: 'informe-general', component: InformeGeneralComponent},
    {path: 'informe-rutas', component: InformeRutasComponent},
    {path: 'prestamos', component: PrestamosComponent},
    {path: 'registro-actividad', component: RegistroActividadComponent},
    {path: 'renovaciones', component: RenovacionesComponent},
    {path: 'solicitudes', component: SolicitudesComponent},
    {path: 'tabulador', component: TabuladorComponent },
    {path: 'agregar-cliente', component: AgregarClienteComponent },
    {path: 'expediente/:id', component: ExpedienteComponent },
    {path: 'editar-cliente/:id', component: EditarClienteComponent},
    {path: 'nueva-renovacion/:id', component:NuevaRenovacionComponent},
    {path: 'revisar-renovacion/:id', component:RevisaRenovacionComponent},
    {path: 'nueva-solicitud', component: NuevaSolicitudComponent},
    {path: 'historial-renovacion', component: HistorialRenovacionesComponent},
    {path: 'historial-solicitud', component: HistorialSolicitudesComponent},
    {path: 'historial-prestamo',component: HistorialPrestamoComponent},
    {path: 'revisar-prestamo/:id', component: RevisarPrestamoComponent},
    {path: 'registro-pago/:id', component: RegistroPagoComponent},
    {path: 'gestion-gestores', component: GestionGestoresComponent},
    {path: 'ajustes', component: AjustesComponent}
]} ,
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
