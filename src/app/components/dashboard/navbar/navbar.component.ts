import { Component, EventEmitter, Output } from '@angular/core';
import { ParametroServiceService } from 'src/app/services/parametro-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

const url_server = environment.url+"/";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  nombreFinanciera = "";
  urlImagen = 'assets/img/config.png';
  lista2:any;
  listaParametros:any=[];

  constructor(private sharedService: SharedService, private parametroService: ParametroServiceService){}

  isMenuOpen = false;

  ngOnInit(): void{
    this.nombreFinanciera = this.sharedService.getFinanciera() ??'FN';
    this.obtenerParametos();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  cerrarSesion(){
    localStorage.removeItem('token');
  }

  obtenerParametos(){
    this.parametroService.getParametrosFinanciera(this.sharedService.getFinanciera()).subscribe(
      (data) => {
        this.lista2 = data;
        this.listaParametros = this.lista2.parametros;

        if(this.listaParametros[0]){
          this.urlImagen = url_server + this.listaParametros[0].urlLogo;
        }
      },
      (error) => {
        console.error('Error al obtener la lista de los parametros:', error);
      });
  }

}
