import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GestorServiceService } from 'src/app/services/gestor-service.service';
import { MatDialogRef } from '@angular/material/dialog';
import { PrestamoServiceService } from 'src/app/services/prestamo-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { PagoServiceService } from 'src/app/services/pago-service.service';
import { environment } from 'src/environments/environment';

const url_server = environment.url+"/";

import { saveAs } from 'file-saver';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
            private gestorService: GestorServiceService, private prestamoService: PrestamoServiceService,
            private sharedService: SharedService, private pagoService:PagoServiceService, private http: HttpClient
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


  
  generarPDF(url: string, documento: string) {

    const imageURL = url_server + url;
  
    // Realizar la solicitud HTTP para verificar si la imagen existe
    this.http.get(imageURL, { responseType: 'blob' }).subscribe(
      (imageBlob) => {
        // Convertir la imagen en base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageBase64 = reader.result as string;
  
          // Verifica que la imagen realmente esté en formato base64
          if (!imageBase64.startsWith('data:image/')) {
            console.error('La imagen no se pudo convertir a base64 correctamente.');
            alert("Hubo un problema con la imagen proporcionada. Por favor Actualicela");
            return;
          }
  
          // Contenido del PDF
          const documentDefinition = {
            content: [
              {
                text: "Cliente: " + this.prestamoEspecifico.nombre + " - " + documento,
                style: 'header',
                bold: true,
              },
              {
                image: imageBase64,
                width: 520, // Ajusta el ancho de acuerdo a tus necesidades
                height: 720,
                absolutePosition: { x: 39, y: 80 }, // Ajusta las coordenadas para alinear en la esquina superior derecha
                opacity: 1, // Establece la opacidad (0 a 1)
              },
            ],
            styles: {
              header: {
                fontSize: 18,
                bold: true,
              }
            }
          };
  
          // Generar el PDF
          const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
  
          // Descargar el PDF con el nombre ingresado
          const pdfFileName = this.prestamoEspecifico.nombre + '_' + documento;
          pdfDocGenerator.getBlob((blob) => {
            saveAs(blob, pdfFileName + '.pdf');
          });
        };
  
        reader.onerror = () => {
          console.error('Error al convertir la imagen a base64.');
          alert("Ocurrió un error al convertir la imagen.");
        };
  
        reader.readAsDataURL(imageBlob);
      },
      (error) => {
        // Aquí puedes manejar el error si la imagen no es encontrada o ocurre otro problema
        if (error.status === 404) {
          console.error('La imagen no existe en la ruta especificada.');
          alert("La imagen no se encontró en la ruta especificada.");
        } else {
          console.error('Ocurrió un error al intentar obtener la imagen:', error);
          alert("Ocurrió un error al intentar obtener la imagen. Por favor, inténtelo más tarde.");
        }
      }
    );
  }

}
