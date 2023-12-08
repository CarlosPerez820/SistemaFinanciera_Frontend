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

@Component({
  selector: 'app-gestion-gestores',
  templateUrl: './gestion-gestores.component.html',
  styleUrls: ['./gestion-gestores.component.css']
})
export class GestionGestoresComponent {
  
  form: FormGroup;
  errorMessage: any;
  lista: any =[];
  editarActivo = false;
  guardarActivo = true;
  elementoEditar: any;

  constructor(private fb: FormBuilder, 
              private matDialog: MatDialog,
              private gestorService: GestorServiceService,
              private _snackBar: MatSnackBar,
              private sharedService: SharedService)
  {    
      this.form = this.fb.group({
      nombre: ['',Validators.required],
      usuario: ['',Validators.required],
      password: ['',Validators.required],
    })
  }

  ngOnInit(): void{
    this.obtenerGestores();
  }

  listaGestores: Gestor[] = [];

  displayedColumns: string[] = ['nombre', 'usuario', 'password','acciones'];
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

  verDetalles(gestor: any){

    this.form.patchValue({
      nombre:gestor.nombre,
      usuario:gestor.usuario,
      password:gestor.password,
    });

    this.editarActivo=true;
    this.guardarActivo=false;

   // this.editarGestor(gestor._id);
    this.elementoEditar = gestor._id;
  }


  

  obtenerGestores(){
    this.gestorService.getGestorFinanciera(this.sharedService.getFinanciera())
    .subscribe( data => {
      console.log(data);
      this.lista = data;
      this.listaGestores = this.lista.gestores;
      console.log(this.listaGestores);

      this.dataSource = new MatTableDataSource(this.listaGestores);

      console.log(this.dataSource);
    })
  }

  editarGestor(id:any){
    const gestor: Gestor={    
      nombre: this.form.value.nombre,
      usuario: this.form.value.usuario,
      password: this.form.value.password,
    }

    this.gestorService.PutGestorFinanciera(id, gestor).subscribe(data => {
      if(data){
        this.obtenerGestores();
        console.log(data);
        alert("Gestor Actualizado");
      }
    }, (error: any) => {
      console.log(error);
      alert("Problemas al actualizar, intente mas tarde");
    })

    this.editarActivo=false;
    this.guardarActivo = true;
    this.form.reset(); 
  }

  eliminarGestor(parametro_id: any){
    this.gestorService.DeleteGestorFinanciera(parametro_id).subscribe(data => {
      if(data){
        console.log(data);
        this.obtenerGestores();
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  registrarGestor(){
    const gestor: Gestor={    
      nombre: this.form.value.nombre,
      usuario: this.form.value.usuario,
      password: this.form.value.password,
      sucursal: this.sharedService.getFinanciera(),
    }
    console.log(gestor);

    this.gestorService.guardarGestor(gestor).pipe(
      catchError((error) => {
        console.error('Error en el registro:', error);
        if (error.error && error.error.errors && error.error.errors.length > 0) {
          this.errorMessage = error.error.errors[0].msg;
          console.log(this.errorMessage);
          this.error(this.errorMessage);
        } else {
          this.errorMessage = 'Error desconocido'; 
          console.log(this.errorMessage);
          this.error(this.errorMessage);
        }
        throw error;
      })
    ).subscribe((data) => {
      if(data){
        console.log("Se registro al gestor correctamente");
        console.log(data);
        this.obtenerGestores();
      }
    });

    this.form.reset(); 
  }

  openDialog(id:any){
    const dialogRef = this.matDialog.open(ConfirmacionComponent,{
      data: { parametro_id: id },
      width:'250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Si se ejecuto el despues de cerrar");
      if (result === 'confirmar') {
        console.log("Si devolvio el confirmar");
        this.eliminarGestor(id);
        // Si se confirma la eliminación, vuelve a cargar la lista
      }
    });
  }

  error(mensaje: string){
    this._snackBar.open(mensaje,'',{
        duration:5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
    })
  }

}







