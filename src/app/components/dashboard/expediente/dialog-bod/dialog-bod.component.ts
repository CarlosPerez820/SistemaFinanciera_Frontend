import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GestorServiceService } from 'src/app/services/gestor-service.service';
import { MatDialogRef } from '@angular/material/dialog';
import { PrestamoServiceService } from 'src/app/services/prestamo-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { PagoServiceService } from 'src/app/services/pago-service.service';

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-dialog-bod',
  templateUrl: './dialog-bod.component.html',
  styleUrls: ['./dialog-bod.component.css']
})
export class DialogBodComponent {

  lista:any;
  prestamoEspecifico:any=[];
  prestamoMongoId:any;
  panelOpenState = false;
  lista3:any;
  listaPagos:any =[];
  currentSlideIndex = 0;
  currentImage: any;
  variableURL= 'https://node-restserver-financiera-production.up.railway.app/';


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
            private gestorService: GestorServiceService, private prestamoService: PrestamoServiceService,
            private sharedService: SharedService, private pagoService:PagoServiceService
            ) {}

  ngOnInit(): void{
    console.log("El id es: "+this.data.parametro_id);
    this.prestamoMongoId=this.data.parametro_id;
    this.obtenerPrestamo();
  }

  obtenerPrestamo(){
    this.prestamoService.getPrestamoEspecifico(this.prestamoMongoId)
    .subscribe( data => {
      console.log(data);
      this.lista = data;
      this.prestamoEspecifico = this.lista.prestamo;
      console.log(this.prestamoEspecifico);
      this.obtenerPagos();
      this.setCurrentImage();
    })
  }

  obtenerPagos(){
    this.pagoService.getPagosPrestamo(this.sharedService.getFinanciera(), this.prestamoEspecifico.folio)
    .subscribe( data => {
      console.log(data);
      this.lista3 = data;
      this.listaPagos = this.lista3.pagos;
      console.log(this.listaPagos);
    })
  }

  setCurrentImage() {
    switch (this.currentSlideIndex) {
      case 0:
        this.currentImage = this.variableURL+this.prestamoEspecifico.urlDinero;
        break;
      case 1:
        this.currentImage = this.variableURL+this.prestamoEspecifico.urlFachada;
        break;
      case 2:
        this.currentImage = this.variableURL+this.prestamoEspecifico.urlPagare;
        break;
      default:
        this.currentImage = '';
        break;
    }
  }

  nextSlide() {
    if (this.currentSlideIndex < 2) {
      this.currentSlideIndex++;
      this.setCurrentImage();
    }
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.setCurrentImage();
    }
  }

}
