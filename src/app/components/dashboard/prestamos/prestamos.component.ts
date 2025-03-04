import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Clientes } from 'src/app/interfaces/clientes';
import { SharedService } from 'src/app/services/shared.service';
import { SolicitudServiceService } from 'src/app/services/solicitud-service.service';
import { PrestamoServiceService } from 'src/app/services/prestamo-service.service';
import { NavigationEnd, Router } from '@angular/router';

//Obtener datos de fecha y hora
var today = new Date();
var day = today.getDate();
var month = today.getMonth() + 1;
var year = today.getFullYear();

// muestra la fecha de hoy en formato `MM/DD/YYYY`
var fechaDia = `${day}-${month}-${year}`;

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent {

  fechaActual = fechaDia;

  listaClientes: Clientes[] = [];

  lista: any=[];
  listaPrestamos: any =[];
  listaPrestamosActivos: any=[];
  listaPrestamosPendiente: any =[];

  displayedColumns: string[] = ['nombre','comienzo','tipoPrestamo', 'cantidadPagar', 'totalRestante','fecha','tipo','gestor','acciones'];
  dataSource = new MatTableDataSource(this.listaPrestamosActivos);
  dataSource2 = new MatTableDataSource(this.listaPrestamosPendiente);

  constructor(private prestamoSrvice: PrestamoServiceService, private sharedService: SharedService,
              private router: Router
  ){}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void{

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/dashboard/prestamos') {
        this.obtenerPrestamosValidos();
      }
    });

    this.obtenerPrestamosValidos();
    console.log(this.fechaActual);
  }
  

  obtenerPrestamosValidos(){
    this.prestamoSrvice.getPrestamosValidosFinanciera(this.sharedService.getFinanciera())
    .subscribe( data => {
      console.log(data);
      this.lista = data;
      this.listaPrestamos = this.lista.prestamos;
      console.log(this.listaPrestamos);
      
   //   this.dataSource = new MatTableDataSource(this.listaSolicitudes);
      this.seleccionarPrestamos();
    })
  }

  seleccionarPrestamos(){
    for(let index = 0; index < this.listaPrestamos.length; index++){
        if(this.listaPrestamos[index].estatus=="Activo"){
          this.listaPrestamosActivos.push(this.listaPrestamos[index]);
        }
        else if(this.listaPrestamos[index].estatus=="Pendiente"){
          this.listaPrestamosPendiente.push(this.listaPrestamos[index]);
        }
    }
    console.log(this.listaPrestamosActivos);
    console.log(this.listaPrestamosPendiente);
    this.dataSource = new MatTableDataSource(this.listaPrestamosActivos);
    this.dataSource2 = new MatTableDataSource(this.listaPrestamosPendiente);
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}