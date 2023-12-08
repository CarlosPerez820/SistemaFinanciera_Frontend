import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Clientes } from 'src/app/interfaces/clientes';
import { SolicitudServiceService } from 'src/app/services/solicitud-service.service';
import { Solicitudes } from 'src/app/interfaces/solicitud';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-renovaciones',
  templateUrl: './renovaciones.component.html',
  styleUrls: ['./renovaciones.component.css']
})
export class RenovacionesComponent {

  listaSolicitudes: Solicitudes[] = [];
  listaSolicitudesRenovaciones: Solicitudes[]=[];
  lista: any=[];

  displayedColumns: string[] = ['nombre', 'fecha','montoSolicitado', 'telefono','gestor','accion'];
  dataSource = new MatTableDataSource(this.listaSolicitudes);

  constructor(private solicitudService: SolicitudServiceService, private sharedService: SharedService){}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void{
    this.obtenerSolicitudesValidas();
  }

  obtenerSolicitudesValidas(){
    this.solicitudService.getSolicitudFinancieraValidos(this.sharedService.getFinanciera())
    .subscribe( data => {
      console.log(data);
      this.lista = data;
      this.listaSolicitudes = this.lista.solicitudes;
      console.log(this.listaSolicitudes);

   //   this.dataSource = new MatTableDataSource(this.listaSolicitudes);
      this.seleccionarSolicitues();
    })
  }

  seleccionarSolicitues(){
    for(let index = 0; index < this.listaSolicitudes.length; index++){
        if(this.listaSolicitudes[index].tipo=="Renovacion"){
          this.listaSolicitudesRenovaciones.push(this.listaSolicitudes[index]);
        }
    }
    this.dataSource = new MatTableDataSource(this.listaSolicitudesRenovaciones);
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