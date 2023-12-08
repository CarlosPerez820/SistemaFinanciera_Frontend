import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InformacionComponent } from './informacion/informacion.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Clientes } from 'src/app/interfaces/clientes';
import { SharedService } from 'src/app/services/shared.service';
import { InteresServiceService } from 'src/app/services/interes-service.service';
import { ClienteServiceService } from 'src/app/services/cliente-service.service';

@Component({
  selector: 'app-tabulador',
  templateUrl: './tabulador.component.html',
  styleUrls: ['./tabulador.component.css']
})
export class TabuladorComponent {

  card1=false;
  card2=false;
  card3=false;
  lista: any=[];
  listaDeInteres: any=[];
  prestado:any;
  plazo:any;
  pagoDiario:any;
  apagar:any;
  lista2: any;
  listaClientes: any = [];
  lista3:any;
  clienteBuscado:any =[];
  valorABuscar:any;
  numeroIdenti:any="";
  numeroDeCreditos=0;
  nombreCliente:any;
  edadCliente:any;
  direccionCliente:any;
  totalSolicitadoCliente=0;

  listaTasaDiaria: any =[];
  listaTasaSemanal: any =[];
  tipoPrestamo:any;

  prestamos: any[] = [
    {value: 'Diario', viewValue: 'Por dia'},
    {value: 'Semanal', viewValue: 'Por semana'},
  ];

  displayedColumns: string[] = ['nombre', 'direccion', 'telefono','identificacion','clasificacion','creditos','acciones'];
  dataSource = new MatTableDataSource(this.listaClientes);

  constructor(private interesService: InteresServiceService, private sharedService: SharedService, 
              private clienteService: ClienteServiceService,  private matDialog: MatDialog){}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit(): void{
    this.obtenerListaDeInteres();
    this.obtenerBuro();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  obtenerListaDeInteres() {
    this.interesService.getinteresFinanciera(this.sharedService.getFinanciera()).subscribe(
      (data) => {
        //console.log(data);
        this.lista2 = data;
        this.listaDeInteres = this.lista2.intereces;
        //console.log();
        this.seleccionarTasas();
      },
      (error) => {
        console.error('Error al obtener la lista de precios:', error);
      }
    );
  }

  seleccionarTasas(){
    for (let index = 0; index < this.listaDeInteres.length; index++) {
      if (this.listaDeInteres[index].tipo=='Diario') {
        this.listaTasaDiaria.push(this.listaDeInteres[index]);
      } else {
        this.listaTasaSemanal.push(this.listaDeInteres[index]);
      }  
    }
  }

  obtenerBuro() {
    console.log("Buro");
    this.clienteService.getBuroClientes().subscribe(
      (data) => {
        //console.log(data);
        this.lista2 = data;
        this.listaClientes = this.lista2.clientes;
        console.log(this.listaClientes);
        this.dataSource = new MatTableDataSource(this.listaClientes);
      },
      (error) => {
        console.error('Error al obtener la lista de precios:', error);
      }
    );
  }

  obtenerResultado(valor: string) {
    console.log("Busqueda");
    this.numeroDeCreditos=0;
    this.numeroIdenti = valor;
    this.clienteService.busquedaCliente(valor).subscribe(
      (data) => {
        this.lista3 = data;
        this.clienteBuscado = this.lista3.clientes;
        console.log("Cliente resultado de la busqueda");
        console.log(this.clienteBuscado);

        if(this.clienteBuscado.length<=0){
          console.log("No hay creditos activos");
          this.card1=true;
          this.card2=false;
          this.card3=false;
        }
        else{
          for (var i = 0; i < this.clienteBuscado.length; i++) {
            if(this.clienteBuscado[i].prestamosActivos==true){

              this.numeroDeCreditos=this.numeroDeCreditos + this.clienteBuscado[i].numeroActivos;
              //this.totalSolicitadoCliente = this.totalSolicitadoCliente + this.clienteBuscado[i].numeroActivos;
              this.nombreCliente=this.clienteBuscado[0].nombre;
              this.edadCliente = this.clienteBuscado[0].edad;
              this.direccionCliente = this.clienteBuscado[0].direccion +","+ this.clienteBuscado[0].colonia;

              this.card1=false;
              this.card2=true;
              this.card3=false;
            } 
          }
          if(this.numeroDeCreditos<=0){
            this.card1=false;
            this.card2=false;
            this.card3=true;
          }
        }

      },
      (error) => {
        console.error('Error al obtener el cliente de la busqueda:', error);
      }
    );
  }

  calcularMontos(){
    let plazoNumber = this.plazo;
    let montoNumber =this.prestado
    let interesPor = 0;
    let interesCantidad =0;
    let total=0;
    let pagoDiario = 0;
    let plazoEnMes=0;

    if(this.tipoPrestamo){

      if(this.tipoPrestamo=='Diario'){
        this.listaTasaDiaria.forEach((interes: any) => {
          if(montoNumber>interes.limiteInferior && montoNumber<=interes.limiteSuperior){
            interesPor=interes.porcentaje;
            interesCantidad = Math.round((montoNumber*interesPor)/100);
    
            total=(montoNumber+interesCantidad);
            this.apagar = total;
    
            pagoDiario=(Math.round((montoNumber+interesCantidad)/plazoNumber));
            this.pagoDiario = pagoDiario;
          }
        });
      }
      else{
        this.listaTasaSemanal.forEach((interes: any) => {
          if(montoNumber>interes.limiteInferior && montoNumber<=interes.limiteSuperior){
            interesPor=interes.porcentaje;

            plazoEnMes = plazoNumber/4;

            interesCantidad  = Math.round((montoNumber*interesPor)/100);
            total=montoNumber+Math.round(interesCantidad*plazoEnMes);
            this.apagar = total;

            pagoDiario=(Math.round((total)/plazoNumber));
            this.pagoDiario = pagoDiario;
          }
        });
      }
    }
    else{
      alert('Por favor selecciona un tipo de prestamo');
    }
  }

  buscar(valorBuscado: string){
    //this.loading = true;
    console.log(valorBuscado);
    this.obtenerResultado(valorBuscado);
  }

  openDialog(id:any){
    this.matDialog.open(InformacionComponent,{
      data: { parametro_id: id },
      width:'500px',
      height:'650px'
    })
  }

}







