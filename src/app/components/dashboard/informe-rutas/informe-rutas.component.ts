import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Clientes } from 'src/app/interfaces/clientes';
import { GestorServiceService } from 'src/app/services/gestor-service.service';
import { Gestor } from 'src/app/interfaces/gestor';
import { SharedService } from 'src/app/services/shared.service';
import { RegistroActividadService } from 'src/app/services/registro-actividad.service';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


@Component({
  selector: 'app-informe-rutas',
  templateUrl: './informe-rutas.component.html',
  styleUrls: ['./informe-rutas.component.css']
})
export class InformeRutasComponent {

  cargar = false;

  lista: any =[];
  listaGestores: Gestor[] = [];

  valorSeleccionado: string | null = null;
  valorDeFecha: any;

  lista2: any =[];
  listaSeguimiento: any[] = [];

  constructor(private gestorService: GestorServiceService, private sharedService: SharedService, private registroActividad: RegistroActividadService){}


  ngOnInit(): void{
    this.obtenerGestores();
  }

  obtenerGestores(){
    this.gestorService.getGestorFinanciera(this.sharedService.getFinanciera())
    .subscribe( data => {
      console.log(data);
      this.lista = data;
      this.listaGestores = this.lista.gestores;
      console.log(this.listaGestores);
    })
  }

  obtenerRegistros(gestor: any, fecha:any){
    this.registroActividad.getRegistroFinancieraFecha(this.sharedService.getFinanciera(), gestor, fecha)
    .subscribe( data => {
      //console.log(data);
      this.lista2=data;
      this.listaSeguimiento = this.lista2.seguimientos;
      //console.log(this.listaSeguimiento);
      this.dataSource = new MatTableDataSource(this.listaSeguimiento);
    })
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const datePipe = new DatePipe('en-US');
    this.valorDeFecha = datePipe.transform(event.value, 'd-M-yyyy');
  }

  displayedColumns: string[] = ['gestor', 'fecha', 'hora','actividad','acciones'];
  dataSource = new MatTableDataSource(this.listaSeguimiento);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  buscar(){
    this.cargar=true;
    console.log(this.valorSeleccionado);
    console.log(this.valorDeFecha);
    this.obtenerRegistros(this.valorSeleccionado, this.valorDeFecha);

  }

  abrirUbicacion(lat:any, lon:any){
  
    var url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}&zoom=20`;
    

    // Abrir una nueva ventana o pestaña con la URL
    window.open(url, '_blank');
  }

}







