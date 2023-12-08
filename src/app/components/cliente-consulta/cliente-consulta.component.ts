import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DialogBodyComponent } from '../dialog-body/dialog-body.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ClienteServiceService } from 'src/app/services/cliente-service.service';
import { PrestamoServiceService } from 'src/app/services/prestamo-service.service';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-cliente-consulta',
  templateUrl: './cliente-consulta.component.html',
  styleUrls: ['./cliente-consulta.component.css']
})
export class ClienteConsultaComponent {
  loading = false;  
  errorCarga = false;
  lista:any;
  clienteEspecifico: any =[];
  mongoIdCliente :any;
  lista2:any;
  listaPrestamos: any =[];
  variableURL= 'https://node-restserver-financiera-production.up.railway.app/';

  currentSlideIndex = 0;
  currentImage: any;

  constructor(private route: ActivatedRoute, private matDialog: MatDialog,
    private clienteService: ClienteServiceService, private prestamoService: PrestamoServiceService,
    private sharedService: SharedService){}

    displayedColumns: string[] = ['folio', 'fecha', 'cantidad', 'estado','acciones'];
    dataSource = new MatTableDataSource(this.listaPrestamos);
  
    currentImageIndex = 0;
  
    setCurrentImage() {
      switch (this.currentSlideIndex) {
        case 0:
          this.currentImage = this.variableURL+this.clienteEspecifico.fotoIneFrente;
          break;
        case 1:
          this.currentImage = this.variableURL+this.clienteEspecifico.fotoIneReverso;
          break;
        case 2:
          this.currentImage = this.variableURL+this.clienteEspecifico.fotoComprobante;
          break;
        default:
          this.currentImage = '';
          break;
      }
    }
  
    ngOnInit(): void{

    }
  
    obtenerCliente(){
      this.clienteService.busquedaClienteNumero(this.mongoIdCliente)
      .subscribe( data => {
          console.log(data);
          this.lista = data;
          console.log(this.lista);
          this.clienteEspecifico = this.lista.clientes[0];
          console.log(this.clienteEspecifico);
          if(this.clienteEspecifico){
            this.obtenerPrestamos();
            this.setCurrentImage();
            this.loading = true;
          }
          else{
            this.errorCarga=true;
          }

      })
    }
  
    obtenerPrestamos(){
      this.prestamoService.getPrestamosCliente(this.clienteEspecifico.sucursal,this.clienteEspecifico.numeroCliente)
      .subscribe( data => {
        console.log(data);
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
  
    /*openDialog(id:any){
      this.matDialog.open(DialogBodComponent,{
        data: { parametro_id: id },
        width:'400px',
        height:'600px'
      })
    }
  */

  buscar(){
    if(this.mongoIdCliente){
      console.log(this.mongoIdCliente);
      this.obtenerCliente();
    }
    else{
      alert("Por favor ingrese tu numero de cliente");
    }
  }

  openDialog(id:any){
    this.matDialog.open(DialogBodyComponent,{
      data: { parametro_id: id },
      width:'400px',
      height:'600px'
    })
  }

}

