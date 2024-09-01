import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { DialogBodComponent } from './dialog-bod/dialog-bod.component';
import { ClienteServiceService } from 'src/app/services/cliente-service.service';
import { PrestamoServiceService } from 'src/app/services/prestamo-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { VariableBinding } from '@angular/compiler';

import { environment } from 'src/environments/environment';

const url_server = environment.url+"/";

@Component({
  selector: 'app-expediente',
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.css']
})
export class ExpedienteComponent {
  
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
              private sharedService: SharedService){}

  displayedColumns: string[] = ['folio', 'tipo',  'fecha', 'cantidad', 'estado','acciones'];
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

  openDialog(id:any){
    this.matDialog.open(DialogBodComponent,{
      data: { parametro_id: id },
      width:'400px',
      height:'600px'
    })
  }

}
