import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { InicioComponent } from './inicio/inicio.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ClientesComponent } from './clientes/clientes.component';
import { RenovacionesComponent } from './renovaciones/renovaciones.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { PrestamosComponent } from './prestamos/prestamos.component';
import { InformeRutasComponent } from './informe-rutas/informe-rutas.component';
import { InformeGeneralComponent } from './informe-general/informe-general.component';
import { RegistroActividadComponent } from './registro-actividad/registro-actividad.component';
import { TabuladorComponent } from './tabulador/tabulador.component';
import { AgregarClienteComponent } from './clientes/agregar-cliente/agregar-cliente.component';
import { ExpedienteComponent } from './expediente/expediente.component';
import { EditarClienteComponent } from './clientes/editar-cliente/editar-cliente.component';
import { NuevaSolicitudComponent } from './solicitudes/nueva-solicitud/nueva-solicitud.component';
import { NuevaRenovacionComponent } from './renovaciones/nueva-renovacion/nueva-renovacion.component';
import { RevisaRenovacionComponent } from './renovaciones/revisa-renovacion/revisa-renovacion.component';
import { RevisarPrestamoComponent } from './prestamos/revisar-prestamo/revisar-prestamo.component';
import { HistorialSolicitudesComponent } from './solicitudes/historial-solicitudes/historial-solicitudes.component';
import { HistorialRenovacionesComponent } from './renovaciones/historial-renovaciones/historial-renovaciones.component';
import { AjustesComponent } from './ajustes/ajustes.component';
import { HistorialPrestamoComponent } from './prestamos/historial-prestamo/historial-prestamo.component';
import { RegistroPagoComponent } from './prestamos/registro-pago/registro-pago.component';
import { GestionGestoresComponent } from './gestion-gestores/gestion-gestores.component';
import { ConfirmacionComponent } from './informe-rutas/confirmacion/confirmacion.component';
import { DialogBodComponent } from './expediente/dialog-bod/dialog-bod.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { InformacionComponent } from './tabulador/informacion/informacion.component';
import { GastosComponent } from './gastos/gastos.component';
import { DotacionComponent } from './dotacion/dotacion.component';
import { DialogImgComponent } from './expediente/dialog-img/dialog-img.component';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    DashboardComponent,
    InicioComponent,
    NavbarComponent,
    ClientesComponent,
    RenovacionesComponent,
    SolicitudesComponent,
    PrestamosComponent,
    InformeRutasComponent,
    InformeGeneralComponent,
    RegistroActividadComponent,
    TabuladorComponent,
    AgregarClienteComponent,
    ExpedienteComponent,
    EditarClienteComponent,
    NuevaSolicitudComponent,
    NuevaRenovacionComponent,
    RevisaRenovacionComponent,
    RevisarPrestamoComponent,
    HistorialSolicitudesComponent,
    HistorialRenovacionesComponent,
    AjustesComponent,
    HistorialPrestamoComponent,
    RegistroPagoComponent,
    GestionGestoresComponent,
    ConfirmacionComponent,
    DialogBodComponent,
    InformacionComponent,
    GastosComponent,
    DotacionComponent,
    DialogImgComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
   // BrowserModule, 
    NgxChartsModule, 
    
  ]
})
export class DashboardModule { }
