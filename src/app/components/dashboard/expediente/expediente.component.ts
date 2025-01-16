import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DialogBodComponent } from './dialog-bod/dialog-bod.component';
import { DialogImgComponent } from './dialog-img/dialog-img.component';
import { ClienteServiceService } from 'src/app/services/cliente-service.service';
import { PrestamoServiceService } from 'src/app/services/prestamo-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { VariableBinding } from '@angular/compiler';
import { saveAs } from 'file-saver';


import { environment } from 'src/environments/environment';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { InfoDialogComponent } from '../../info-dialog/info-dialog.component';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

const url_server = environment.url+"/";

@Component({
  selector: 'app-expediente',
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.css']
})
export class ExpedienteComponent {
  
  pdfObject:any;
  lista:any;
  clienteEspecifico: any =[];
  mongoIdCliente :any;
  lista2:any;
  listaPrestamos: any =[];

  currentSlideIndex = 0;
  currentImage: any;
  variableURL = url_server;

  constructor(private route: ActivatedRoute, private matDialog: MatDialog,
              private clienteService: ClienteServiceService, private prestamoService: PrestamoServiceService,
              private sharedService: SharedService, private http: HttpClient){}

  displayedColumns: string[] = ['folio', 'tipo',  'fecha', 'cantidad','restante','adeudo', 'retrasos','estado','acciones'];
  dataSource = new MatTableDataSource(this.listaPrestamos);

  currentImageIndex = 0;

  setCurrentImage() {
    switch (this.currentSlideIndex) {
      case 0:
        this.currentImage = url_server+this.clienteEspecifico.fotoIneFrente;
        break;
      case 1:
        this.currentImage = url_server+this.clienteEspecifico.fotoIneReverso;
        break;
      case 2:
        this.currentImage = url_server+this.clienteEspecifico.fotoComprobante;
        break;
      case 3:
        this.currentImage = url_server+this.clienteEspecifico.fotoFachada;
        break;
      default:
        this.currentImage = '';
        break;
    }
  }

  ngOnInit(): void{
    this.mongoIdCliente = this.route.snapshot.paramMap.get("id");
    console.log(this.mongoIdCliente);
    this.obtenerCliente();
  }

  obtenerCliente(){
    this.clienteService.getClienteEspecifico(this.mongoIdCliente)
    .subscribe( data => {
      console.log(data);
      this.lista = data;
      this.clienteEspecifico = this.lista.cliente;
      console.log(this.clienteEspecifico.numeroCliente);
      this.obtenerPrestamos();
      this.setCurrentImage();
    })
  }

  descargarArchivo(url: string) {
    window.open(url, '_blank');
  }
  

  obtenerPrestamos(){
    this.prestamoService.getPrestamosCliente(this.sharedService.getFinanciera(),this.clienteEspecifico.numeroCliente)
    .subscribe( data => {
      console.log(data);
      this.lista2 = data;
      this.listaPrestamos = this.lista2.prestamos;
      console.log(this.listaPrestamos);
      this.dataSource = new MatTableDataSource(this.listaPrestamos);
    })
  }

  nextSlide() {
    if (this.currentSlideIndex < 3) {
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

  openDialog(id:any){
    this.matDialog.open(DialogBodComponent,{
      data: { parametro_id: id },
      width:'500px',
      height:'700px'
    })
  }

  openDialogImg(url:string){
    const imageURL = url_server + url;

    this.matDialog.open(DialogImgComponent,{
      data: { parametro_url: imageURL },
      width:'500px',
      height:'700px'
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
            this.openDialog2("Hubo un problema con la imagen proporcionada. Por favor Actualicela", "assets/img/error.png");
            return;
          }
  
          // Contenido del PDF
          const documentDefinition = {
            content: [
              {
                text: "Cliente: " + this.clienteEspecifico.nombre + " - " + documento,
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
          const pdfFileName = this.clienteEspecifico.nombre + '_' + documento;
          pdfDocGenerator.getBlob((blob) => {
            saveAs(blob, pdfFileName + '.pdf');
          });
        };
  
        reader.onerror = () => {
          console.error('Error al convertir la imagen a base64.');
          this.openDialog2("Ocurrió un error al convertir la imagen", "assets/img/error.png");
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
          this.openDialog2("Ocurrió un error al intentar obtener la imagen. Por favor, inténtelo más tarde.", "assets/img/error.png");

        }
      }
    );
  }
  
  openDialog2(mensaje: string, imagen:string): void {
    this.matDialog.open(InfoDialogComponent, {
      width: '300px',  // Ajusta el ancho según sea necesario
      data: {
        message: mensaje,
        imageUrl: imagen  // Ruta de la imagen que quieres mostrar
      },
      disableClose: true // Deshabilita el cierre al hacer clic fuera del diálogo
    });
  }

  
}
