import { Component, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Clientes } from 'src/app/interfaces/clientes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmacionComponent } from '../informe-rutas/confirmacion/confirmacion.component';
import { GestorServiceService } from 'src/app/services/gestor-service.service';
import { Gestor } from 'src/app/interfaces/gestor';
import { catchError } from 'rxjs/internal/operators/catchError';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/services/shared.service';
import { InfoDialogComponent } from '../../info-dialog/info-dialog.component';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { Gasto } from 'src/app/interfaces/gasto';
import { GastosService } from 'src/app/services/gastos.service';
import { Dotacion } from 'src/app/interfaces/dotacion';
import { DotacionService } from 'src/app/services/dotacion.service';

@Component({
  selector: 'app-dotacion',
  templateUrl: './dotacion.component.html',
  styleUrls: ['./dotacion.component.css']
})
export class DotacionComponent {


  form: FormGroup;
  errorMessage: any;
  lista: any =[];
  listaMetodos: string[] = ['Efectivo','Digital'];
  editarActivo = false;
  guardarActivo = true;
  elementoEditar: any;
  fecha: any;
  fechaInicio: any;
  gestorSeleccionado: any;
  isLoading = false;
  valorGastos: number = 0;
  lista2: any = [];

  constructor(private fb: FormBuilder, 
              private matDialog: MatDialog,
              private gestorService: GestorServiceService,
              private _snackBar: MatSnackBar,
              private sharedService: SharedService,
              private dotacionService: DotacionService,
              private dialog:MatDialog)
  {    
      this.form = this.fb.group({
      fecha: ['',Validators.required],
      monto: ['',Validators.required],
      gestor: ['',Validators.required],

    })
  }

  ngOnInit(): void{
    this.obtenerGestores();
    this.fecha = moment().format('YYYY-MM-DD');
  }

  listaGestores: Gestor[] = [];
  listaDotacion: Dotacion[] = [];

  displayedColumns: string[] = ['fecha', 'gestor', 'monto'];
  listaCategorias: string[] = [
    'Gastos de personal',
    'Gastos de suministros',
    'Gastos de servicios',
    'Gastos de marketing y publicidad',
    'Gastos de transporte',
    'Gastos de viajes',
    'Gastos financieros',
    'Gastos imprevistos',
    'Otros gastos'
  ];

  dataSource = new MatTableDataSource(this.listaGestores);

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

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const datePipe = new DatePipe('en-US');
    this.fecha = datePipe.transform(event.value, 'yyyy-MM-dd');
    console.log(this.fecha);
  }

  onDateChange2(event: MatDatepickerInputEvent<Date>) {
    const datePipe = new DatePipe('en-US');
    this.fechaInicio = datePipe.transform(event.value, 'yyyy-MM-dd');
    console.log(this.fechaInicio);
  }

  buscar(){
    console.log("hola "+this.fechaInicio);
    this.obtenerDotacionesFecha();
  }

  buscar2(){
    this.obtenerDotacionesGestor();
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

  obtenerDotacionesFecha(){
    this.listaDotacion=[];
    this.dotacionService.getDotacionFecha(this.sharedService.getFinanciera(), this.fechaInicio)
    .subscribe( data => {
      console.log(data);
      this.lista2 = data;
      this.listaDotacion = this.lista2.dotaciones;
      console.log(this.listaDotacion);

      this.dataSource = new MatTableDataSource(this.listaDotacion);
    })
  }

  obtenerDotacionesGestor(){
    console.log("hola"+ this.gestorSeleccionado);
    this.listaDotacion=[];
    this.dotacionService.getDotacionGestor(this.sharedService.getFinanciera(), this.gestorSeleccionado)
    .subscribe( data => {
      console.log(data);
      this.lista2 = data;
      this.listaDotacion = this.lista2.dotaciones;
      console.log(this.listaDotacion);

      this.dataSource = new MatTableDataSource(this.listaDotacion);
    })
  }

  openDialogInfo(mensaje: string, imagen:string): void {
    this.matDialog.open(InfoDialogComponent, {
      width: '300px',  // Ajusta el ancho según sea necesario
      data: {
        message: mensaje,
        imageUrl: imagen  // Ruta de la imagen que quieres mostrar
      },
      disableClose: true // Deshabilita el cierre al hacer clic fuera del diálogo
    });
  }


  registrarDotacion(){
    const dotacion: Dotacion={
      sucursal: this.sharedService.getFinanciera(),
      fecha: this.fecha,
      monto: this.form.value.monto,
      gestor: this.form.value.gestor
    }

    this.dotacionService.postDotacion(dotacion).subscribe(
      (response) => {
      console.log('Gasto registrado con éxito:');
      console.log(response);
      this.openDialog("Gasto registrado con éxito", "assets/img/exito.png");

      this.isLoading = false;  
    },
    (error) => {
      console.error('Error al registrar la dotacion del gestor:', error);
      this.isLoading = false;  
      alert("Hay problemas al registrar la dotacion del gestor");
    });
    this.form.reset(); 
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






}