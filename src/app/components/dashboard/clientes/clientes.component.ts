import { Component, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Clientes } from 'src/app/interfaces/clientes';
import { SharedService } from 'src/app/services/shared.service';
import { ClienteServiceService } from 'src/app/services/cliente-service.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { InfoDialogComponent } from '../../info-dialog/info-dialog.component';
import { MatDialog } from '@angular/material/dialog';

const url_server = environment.url+"/";

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent {

  _urlserver = url_server;
  listaClientes: Clientes[] = [];
  lista: any = [];
  selectedOptions: string[] = [];

  displayedColumns: string[] = ['nombre', 'direccion', 'gestorAsignado','prestamosActivos','clasificacion','acciones'];
  dataSource = new MatTableDataSource(this.listaClientes);

  selectedCliente: any = null; // Variable para almacenar el cliente seleccionado
  searchTerm: string = ''; // Variable para almacenar el texto de búsqueda

  constructor(private clienteService: ClienteServiceService, private sharedService: SharedService,private router: Router,  private matDialog: MatDialog){}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void{
    this.obtenerClientes();
  }

  toggleMenu(cliente: any) {
    // Alterna el menú del cliente seleccionado
    this.selectedCliente = this.selectedCliente === cliente ? null : cliente;
  }

  // Método para filtrar la lista de clientes según el término de búsqueda
  get filteredClientes(): Clientes[] {
    if (!this.searchTerm) {
      return this.listaClientes; // Si no hay búsqueda, devuelve todos los clientes
    }

    // Devuelve solo los clientes cuyo nombre coincida con el término de búsqueda
    return this.listaClientes.filter(cliente =>
      (cliente.nombre || '').toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


  obtenerClientes(){
    this.clienteService.getClientesFinanciera(this.sharedService.getFinanciera())
    .subscribe( data => {
      console.log(data);
      this.lista = data;
      this.listaClientes = this.lista.clientes;
      console.log(this.listaClientes);

      this.dataSource = new MatTableDataSource(this.listaClientes);
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

  filtro(filterValue: string, column: string): void {
    if (filterValue.toLowerCase() === 'todos') {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const columnValue = data[column];
    
        // Verifica si columnValue es una cadena antes de llamar a toLowerCase()
        if (typeof columnValue === 'string') {
          return columnValue.toLowerCase().includes(filter);
        }
    
        // Si no es una cadena, retorna false para evitar el error
        return false;
      };
    
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  navegarARenovacion(clienteId: any, adeudo: any, clasificacion:any) {
    if(clasificacion=="C"){
      this.openDialog2("No se puede generar una renovación debido a la clasificacion C de este cliente", "assets/img/info.png");
    }
    else{
      if(adeudo>0){
        this.openDialog2("No se puede generar una renovación ya que el cliente cuenta con un adeudo de $"+adeudo, "assets/img/info.png");
      }
      else{
        this.router.navigate(['/dashboard/nueva-renovacion', clienteId]);
      }
    }
   
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







