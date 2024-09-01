import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Clientes } from 'src/app/interfaces/clientes';
import { Solicitudes } from 'src/app/interfaces/solicitud';
import { SharedService } from 'src/app/services/shared.service';
import { SolicitudServiceService } from 'src/app/services/solicitud-service.service';
import { saveAs } from 'file-saver';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
import { ParametroServiceService } from 'src/app/services/parametro-service.service';
import { environment } from 'src/environments/environment';
import { InfoDialogComponent } from 'src/app/components/info-dialog/info-dialog.component';
import { MatDialog } from '@angular/material/dialog';

const url_server = environment.url+"/";

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-historial-solicitudes',
  templateUrl: './historial-solicitudes.component.html',
  styleUrls: ['./historial-solicitudes.component.css']
})
export class HistorialSolicitudesComponent {

  imageURL: string = 'http&rs=1';
  pdfFileName: string = 'mi_pdf';
  pdfObject:any;

  listaSolicitudes: Solicitudes[] = [];
  listaSolicitudesEspecificas: Solicitudes[]=[];
  lista: any=[];

  lista2: any=[];
  listaParametros: any=[];

  displayedColumns: string[] = ['nombre', 'montoSolicitado', 'telefono','tipo','gestor','accion'];
  dataSource = new MatTableDataSource(this.listaSolicitudes);

  constructor(private solicitudService: SolicitudServiceService, private sharedService: SharedService, 
              private http: HttpClient, private parametroService: ParametroServiceService, private dialog: MatDialog){
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void{
    this.obtenerSolicitudesValidas();
    this.obtenerParametos();
  }

  obtenerSolicitudesValidas(){
    this.solicitudService.getSolicitudFinancieraTipos(this.sharedService.getFinanciera(), 'Nueva')
    .subscribe( data => {
      console.log(data);
      this.lista = data;
      this.listaSolicitudes = this.lista.solicitudes;
      console.log(this.listaSolicitudes);

      this.dataSource = new MatTableDataSource(this.listaSolicitudes);
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(mensaje: string, imagen:string): void {
    this.dialog.open(InfoDialogComponent, {
      width: '300px',  // Ajusta el ancho según sea necesario
      data: {
        message: mensaje,
        imageUrl: imagen  // Ruta de la imagen que quieres mostrar
      },
      disableClose: true // Deshabilita el cierre al hacer clic fuera del diálogo
    });
  }

  obtenerParametos(){
    this.parametroService.getParametrosFinanciera(this.sharedService.getFinanciera()).subscribe(
      (data) => {
        //console.log(data);
        this.lista2 = data;
        this.listaParametros = this.lista2.parametros;
        console.log(this.listaParametros);
      },
      (error) => {
        console.error('Error al obtener la lista de los parametros:', error);
      });
  }

  

  generarPDF(row: any) {
    const indice = this.dataSource.data.indexOf(row);
    console.log('El índice es:', indice);

    let objetoSolicitud:any;
    if(this.listaSolicitudes[indice]){
      objetoSolicitud = this.listaSolicitudes[indice];
    }

    console.log(this.listaSolicitudes[indice]);

    if(this.listaParametros.length==0){
      this.openDialog("Es necesario subir primero su logo para generar un PDF", "assets/img/error.png");
    }


    this.imageURL= url_server+ this.listaParametros[0].urlLogo;

    console.log(this.imageURL);
        // Realizar la solicitud HTTP para obtener la imagen
        this.http.get(this.imageURL, { responseType: 'blob' }).subscribe(
          (imageBlob) => {
            // Convertir la imagen en base64
            const reader = new FileReader();
            reader.onloadend = () => {
              const imageBase64 = reader.result as string;
    
              // Contenido del PDF
              const documentDefinition = {
                content: [
                  {
                    text: objetoSolicitud.sucursal+'\n'+'Solicitud Para Prestamo'+'\n'+'\n'+'\n'+'\n',
                    style: 'header',
                    bold: true,
                  },
                  {
                    image: imageBase64,
                    width: 200, // Ajusta el ancho de acuerdo a tus necesidades
                    height: 140,
                    absolutePosition: { x: 350, y: 10 }, // Ajusta las coordenadas para alinear en la esquina superior derecha
                    opacity: 0.3, // Establece la opacidad (0 a 1)
                  },
                  {
                    text: '\n'+'Información del Prestamo'+'\n',
                    style: 'header',
                    bold: true,
                  },
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*', 'auto'],
                      body: [
                        ['Solicitante:'+objetoSolicitud.nombre, 'Fecha:'+objetoSolicitud.fechaSolicitud],
                        ['Monto Solicitado:$'+objetoSolicitud.montoSolicitado, 'Monto Autorizado:$'+objetoSolicitud.montoAutorizado]
                      ]
                    }
                  },
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*', '*','*'],
                      body: [
                        ['Plazo:'+objetoSolicitud.plazo+' dias', 'Total a Pagar:$'+objetoSolicitud.totalPagar, 'Pago Diario:$'+objetoSolicitud.pagoDiario]                      
                      ]
                    }
                  },
                  {
                    text: '\n'+'\n'+'Información del Cliente'+'\n',
                    style: 'header',
                    bold: true,
                  },
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*'],
                      body: [
                        ['Numero de cliente: '+objetoSolicitud.numeroCliente],
                        ['Dirección: '+objetoSolicitud.direccion],
                        ['Colonia:'+objetoSolicitud.colonia],
                        ['Ciudad:'+objetoSolicitud.ciudad],
                      ]
                    }
                  },
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*'],
                      body: [
                        ['Celular:'+objetoSolicitud.celular]                      
                      ]
                    }
                  },
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*'],
                      body: [
                        ['Estado Civil: '+objetoSolicitud.estadoCivil],
                        ['Tipo de vivienda:'+objetoSolicitud.tipoVivienda],
                        ['Tiempo viviendo en su domicilio: '+objetoSolicitud.tiempoViviendo], 
                        ['Pago de renta:'+objetoSolicitud.pagoRenta],
                        ['Tiempo del negocio: '+objetoSolicitud.tiempoNegocio],
                        ['Numero de identificación: '+objetoSolicitud.numeroIdentificacion],
                        ['RFC: '+objetoSolicitud.RFC],
                        ['Nombre del conyugue: '+objetoSolicitud.nombreConyugue], 
                        ['Ingreso del Solicitante: $' + objetoSolicitud.ingresoSolicitante],
                        ['Se necesita el credito para: '+objetoSolicitud.infoCredito],

                        
                      ]
                    }
                  },
                  {
                    text:  '\n' + "Información de la Solicitud:",
                    style: 'header',
                    bold: true,
                  },
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*', 'auto'],
                      body: [
                        ['Estado: '+objetoSolicitud.estatus, 'Tipo de Solicitud: '+objetoSolicitud.tipo],
                        ['Gestor Agisnado: '+objetoSolicitud.gestorAsignado, ''],

                      ]
                    }
                  },
                  {
                    text: '\n'+'\n'+'\n'+'\n'+'\n'+'\n'+ "Este documento es una solicitud de préstamo. La aprobación del mismo está sujeta a la evaluación crediticia y políticas de ."+objetoSolicitud.sucursal + "."+
                        "El solicitante declara que toda la información proporcionada es veraz y que ha leído y comprendido los términos y condiciones del préstamo.",
                    style:'pie',
                    
                  },
                ],
                styles: {
                  header: {
                    fontSize: 18,
                    bold: true,
                  },
                  pie:{
                    fontSize: 10
                    
                  }
                }
              };
    
              // Generar el PDF
              const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    
              // Descargar el PDF con el nombre ingresado
              this.pdfFileName='Solicitud_'+objetoSolicitud.nombre+'_'+objetoSolicitud.fechaSolicitud;
              pdfDocGenerator.getBlob((blob) => {
                saveAs(blob, this.pdfFileName + '.pdf');
              });
            };
            reader.readAsDataURL(imageBlob);
          },
          (error) => {
            console.error('Error al obtener la imagen:', error);
            alert("Hace falta su logo para crear su documento");
            // Aquí puedes manejar el error, por ejemplo, mostrar un mensaje al usuario
          });
    }


}

