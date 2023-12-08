import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GestorServiceService } from 'src/app/services/gestor-service.service';
import { MatDialogRef } from '@angular/material/dialog';
import { PrestamoServiceService } from 'src/app/services/prestamo-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { PagoServiceService } from 'src/app/services/pago-service.service';
import { ClienteServiceService } from 'src/app/services/cliente-service.service';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.css']
})
export class InformacionComponent {

  clienteMongoId:any;
  lista:any=[];
  clienteEspecifico:any;
  lista2:any=[];
  listaTodosPrestamos:any=[];
  listaPrestamos:any=[];
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private clienteService: ClienteServiceService,
            private prestamoService: PrestamoServiceService,
            private sharedService: SharedService, private pagoService:PagoServiceService
            ) {}

  displayedColumns: string[] = ['fecha', 'cantidad', 'plazo'];
  dataSource = new MatTableDataSource(this.listaPrestamos);

  ngOnInit(): void{
    console.log("El id del cliente BURO es: "+this.data.parametro_id);
    this.clienteMongoId=this.data.parametro_id;
    this.obtenerCliente();
  }

  obtenerCliente(){
    this.clienteService.getClienteEspecifico(this.clienteMongoId)
    .subscribe( data => {
      console.log(data);
      this.lista = data;
      this.clienteEspecifico = this.lista.cliente;
      console.log(this.clienteEspecifico);
      this.obtenerPrestamos();
    })
  }

  obtenerPrestamos(){
    this.prestamoService.getPrestamosCliente(this.sharedService.getFinanciera(),this.clienteEspecifico.numeroCliente)
    .subscribe( data => {
      console.log(data);
      this.lista2 = data;
      this.listaTodosPrestamos = this.lista2.prestamos;
      console.log(this.listaTodosPrestamos);

      for(let i=0; i<this.listaTodosPrestamos.length;i++){
        if(this.listaTodosPrestamos[i].estatus=="Activo")
        {
          this.listaPrestamos.push(this.listaTodosPrestamos[i]);
        }
        
      }

      this.dataSource = new MatTableDataSource(this.listaPrestamos);
    })
  }
}
