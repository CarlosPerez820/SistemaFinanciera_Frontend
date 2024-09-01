import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GestorServiceService } from 'src/app/services/gestor-service.service';
import { MatDialogRef } from '@angular/material/dialog';
import { PrestamoServiceService } from 'src/app/services/prestamo-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { PagoServiceService } from 'src/app/services/pago-service.service';
import { environment } from 'src/environments/environment';

const url_server = environment.url+"/";

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyComponent {

  lista:any;
  prestamoEspecifico:any=[];
  prestamoMongoId:any;
  panelOpenState = false;
  lista3:any;
  listaPagos:any =[];
  currentSlideIndex = 0;
  currentImage: any;

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
    this.pagoService.getPagosPrestamo(this.prestamoEspecifico.sucursal, this.prestamoEspecifico.folio)
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
        this.currentImage = url_server+this.prestamoEspecifico.urlDinero;
        break;
      case 1:
        this.currentImage = url_server+this.prestamoEspecifico.urlFachada;
        break;
      case 2:
        this.currentImage = url_server+this.prestamoEspecifico.urlPagare;
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
