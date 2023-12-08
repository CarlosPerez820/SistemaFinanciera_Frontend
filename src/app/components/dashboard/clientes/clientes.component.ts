import { Component, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Clientes } from 'src/app/interfaces/clientes';
import { SharedService } from 'src/app/services/shared.service';
import { ClienteServiceService } from 'src/app/services/cliente-service.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent {

  listaClientes: Clientes[] = [];
  lista: any = [];
  selectedOptions: string[] = [];

  displayedColumns: string[] = ['nombre', 'direccion', 'gestorAsignado','prestamosActivos','clasificacion','acciones'];
  dataSource = new MatTableDataSource(this.listaClientes);

  constructor(private clienteService: ClienteServiceService, private sharedService: SharedService){}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void{
    this.obtenerClientes();
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
    

}







