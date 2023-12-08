import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroUserComponent } from './components/registro-user/registro-user.component';
import { ClienteConsultaComponent } from './components/cliente-consulta/cliente-consulta.component';
import { RenovacionClienteComponent } from './components/cliente-consulta/renovacion-cliente/renovacion-cliente.component';
import { InfoPrestamoClienteComponent } from './components/info-prestamo-cliente/info-prestamo-cliente.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'registro', component: RegistroUserComponent},
  {path: 'consultaCli',component: ClienteConsultaComponent},
  {path: 'renovacion-cliente', component: RenovacionClienteComponent},
  {path: 'info-prestamo-cliente', component: InfoPrestamoClienteComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'dashboard', loadChildren:()=> import('./components/dashboard/dashboard.module').then(x => x.DashboardModule), canActivate: [AuthGuard]},
  {path: '**', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
