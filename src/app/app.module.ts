import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';


//Componentes
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from './components/shared/shared.module';
import { ClienteConsultaComponent } from './components/cliente-consulta/cliente-consulta.component';
import { RegistroUserComponent } from './components/registro-user/registro-user.component';
import { RenovacionClienteComponent } from './components/cliente-consulta/renovacion-cliente/renovacion-cliente.component';
import { InfoPrestamoClienteComponent } from './components/info-prestamo-cliente/info-prestamo-cliente.component';
import { DialogBodyComponent } from './components/dialog-body/dialog-body.component';

import {MatButtonModule} from '@angular/material/button';
import { InfoDialogComponent } from './components/info-dialog/info-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClienteConsultaComponent,
    RegistroUserComponent,
    RenovacionClienteComponent,
    InfoPrestamoClienteComponent,
    DialogBodyComponent,
    InfoDialogComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    MatButtonModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
