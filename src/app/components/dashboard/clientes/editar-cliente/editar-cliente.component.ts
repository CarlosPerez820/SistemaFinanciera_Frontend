import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Clientes } from 'src/app/interfaces/clientes';
import { Gestor } from 'src/app/interfaces/gestor';
import { ClienteServiceService } from 'src/app/services/cliente-service.service';
import { GestorServiceService } from 'src/app/services/gestor-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { UploadService } from 'src/app/services/upload.service';
import { ConfirmacionComponent } from '../../informe-rutas/confirmacion/confirmacion.component';
import { InfoDialogComponent } from 'src/app/components/info-dialog/info-dialog.component';

import { environment } from 'src/environments/environment';
import { Prestamo } from 'src/app/interfaces/prestamo';
import { PrestamoServiceService } from 'src/app/services/prestamo-service.service';

const url_server = environment.url+"/";

//Obtener datos de fecha y hora
var today = new Date();
var day = today.getDate();
var month = today.getMonth() + 1;
var year = today.getFullYear();
var hour = today.getHours();
var minutes =  today.getMinutes();
var segundes =  today.getSeconds();

// muestra la fecha de hoy en formato `MM/DD/YYYY`
var fechaDia = `${day}-${month}-${year}`;

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css']
})
export class EditarClienteComponent {

 //Vaiables Globales
  fecha_Solicitud: string =fechaDia;
  lista: any =[];
  listaGestores: Gestor[] = [];
  listaClasificaciones: string[] = ['A'];
  clasificacionSeleccionada: string = '';

  form: FormGroup;
  numeroDeClienteID: any;
  mongoIdCliente: any;
  activo = false;
  lista2:any = [];
  clienteEspecifico: any = [];
  lista3: any = [];
  lista4: Prestamo[] = [];
  listaPrestamos: Prestamo[] = [];
  

  isLoading = false;
  
  //barra de progeso
  subiendoArchivo: boolean = false; // Controla la visibilidad de la barra de progreso
  progreso: number = 0; // Valor de progreso para la barra

  viviendas: any[] = [
    {value: 'Propia', viewValue: 'Propia'},
    {value: 'Rentada', viewValue: 'Rentada'},
    {value: 'Familiar', viewValue: 'Familiar'},
  ];

  variableURL = url_server;
  imgMostrar = "";

  constructor(private fb: FormBuilder, private gestorService: GestorServiceService, private sharedService: SharedService,
              private clienteService: ClienteServiceService, private route: ActivatedRoute, private dialog: MatDialog,
              private imageCompress: NgxImageCompressService, private uploadService: UploadService,
              private matDialog: MatDialog,  private router: Router, private prestamoService: PrestamoServiceService)
              {
    this.form = this.fb.group({
      numeroCliente: ['',Validators.required],
      nombreSolicitante: ['',Validators.required],
      direccion: ['',Validators.required],
      colonia: ['',Validators.required],
      ciudad: ['',Validators.required],
      celular: ['',Validators.required],
      telefono: [''],
      estadoCivil: ['',Validators.required],
      tipoVivienda: ['',Validators.required],
      tiempoVivienda: [''],
      pagoRenta: [''],
      tiempoNegocio: [''],
      tipoNegocio: [''],
      direccionNegocio: [''],
      numeroINE: ['',Validators.required],
      conyugue: ['',Validators.required],
      ingresoSolicitante: ['',Validators.required],
      creditosActuales: [''],
      creditosGenerales:[''],
      gestor: ['',Validators.required],
    })
  }

  ngOnInit(): void{
    this.obtenerGestores();
    this.mongoIdCliente = this.route.snapshot.paramMap.get("id");
    console.log(this.mongoIdCliente);
    this.obtenerCliente();
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

  obtenerCliente(){
    this.clienteService.getClienteEspecifico(this.mongoIdCliente)
    .subscribe( data => {
      console.log(data);
      this.lista2 = data;
      this.clienteEspecifico = this.lista2.cliente;
      console.log(this.clienteEspecifico);
      this.imgMostrar = this.clienteEspecifico.fotoPerfil;
      this.llenarFormulario();
      this.obtenerPrestamos();
    })
  }

  llenarFormulario(){
    console.log(this.clienteEspecifico.nombre);
    console.log(this.clienteEspecifico.numeroCliente);
    this.numeroDeClienteID = this.clienteEspecifico.numeroCliente;

    this.form.patchValue({
      numeroCliente: this.clienteEspecifico.numeroCliente,
      nombreSolicitante: this.clienteEspecifico.nombre,
      direccion:  this.clienteEspecifico.direccion,
      colonia:  this.clienteEspecifico.colonia,
      ciudad:  this.clienteEspecifico.ciudad,
      celular:  this.clienteEspecifico.celular,
      telefono:this.clienteEspecifico.telefonoAdicional,
      tipoNegocio:this.clienteEspecifico.tipoNegocio,
      direccionNegocio:this.clienteEspecifico.direccionNegocio,
      creditosGenerales:this.clienteEspecifico.creditosGenerales,
      estadoCivil:  this.clienteEspecifico.estadoCivil,
      tipoVivienda:  this.clienteEspecifico.tipoVivienda,
      tiempoVivienda:  this.clienteEspecifico.tiempoViviendo,
      pagoRenta:  this.clienteEspecifico.pagoRenta,
      tiempoNegocio:  this.clienteEspecifico.tiempoNegocio,
      numeroINE:  this.clienteEspecifico.numeroIdentificacion,
      conyugue:  this.clienteEspecifico.nombreConyugue,
      ingresoSolicitante:  this.clienteEspecifico.ingresoSolicitante,
      creditosActuales:  this.clienteEspecifico.numeroPrestamos,
      gestor:  this.clienteEspecifico.gestorAsignado
    });
  }

  EnviarDatos(){
    this.editarUsuario();
  }

  editarUsuario(){
    if (this.isLoading) {
      return;  
    }
    this.isLoading = true;  

    this.verificarCamposOpcionales();

    const cliente: Clientes = {
      nombre: this.eliminarAcentos2(this.form.value.nombreSolicitante),
      direccion: this.form.value.direccion,
      colonia: this.form.value.colonia,
      ciudad: this.form.value.ciudad,
      celular: this.form.value.celular,
      estadoCivil: this.form.value.estadoCivil,
      tipoVivienda: this.form.value.tipoVivienda,
      tiempoViviendo: this.form.value.tiempoVivienda,
      pagoRenta: this.form.value.pagoRenta,
      tiempoNegocio: this.form.value.tiempoNegocio,
      numeroIdentificacion: this.form.value.numeroINE,
      nombreConyugue: this.form.value.conyugue,
      ingresoSolicitante: this.form.value.ingresoSolicitante,
      telefonoFijo:this.form.value.telefono,
      tipoNegocio:this.form.value.tipoNegocio,
      direccionNegocio:this.form.value.direccionNegocio,
      creditosGenerales:this.form.value.creditosGenerales,
      gestorAsignado: this.form.value.gestor,
    }
    console.log(cliente);

    this.clienteService.PutClienteFinanciera(this.mongoIdCliente, cliente).subscribe(data => {
      if(data){
        console.log(data);
        this.actualizarPrestamo();
        this.isLoading = false;
        this.openDialogInfo("Se edito la información correctamente", "assets/img/exito.png");
      }
    }, (error: any) => {
      console.log(error);
      this.isLoading = false;  
      this.openDialogInfo("Lo sentimos, hubo un error y no se actualizo la información", "assets/img/error.png");
    })
  }

  cambiarClasificacion(){
       if (this.isLoading) {
      return;  
    }
    this.isLoading = true;  

    const cliente: Clientes = {
      clasificacion: this.clasificacionSeleccionada,
      puntuacion: '0',
    }

    this.clienteService.PutClienteFinanciera(this.mongoIdCliente, cliente).subscribe(data => {
      if(data){
        console.log(data);
        this.actualizarPrestamo();
        this.isLoading = false;
        this.openDialogInfo("Se cambio la clasificacion correctamente", "assets/img/exito.png");
      }
    }, (error: any) => {
      console.log(error);
      this.isLoading = false;  
      this.openDialogInfo("Lo sentimos, hubo un error y no se actualizo la información", "assets/img/error.png");
    }) 
  }
  
  obtenerPrestamos(){
    this.prestamoService.getPrestamosCliente(this.sharedService.getFinanciera(), this.clienteEspecifico.numeroCliente)
      .subscribe( data => {
        console.log("Los prestamos del cliente");
        console.log(data);
        this.lista3 = data;
        this.lista4 = this.lista3.prestamos;

        // Filtrar los préstamos cuyo estatus sea diferente a "Finalizado"
        this.listaPrestamos = this.lista4.filter(prestamo => prestamo.estatus !== "Finalizado");
        console.log("Los prestamos Seleccionados del cliente");
        console.log(this.listaPrestamos);
      });
  }
  
  actualizarPrestamo() {
    const prestamo: Prestamo = {
      gestor: this.form.value.gestor,
      nombre: this.form.value.nombreSolicitante,
      direccion: this.form.value.direccion,
      colonia: this.form.value.colonia,
      telefono: this.form.value.celular,
    };
  
    let actualizacionesCompletadas = 0;
    let errores = 0;
  
    this.listaPrestamos.forEach(prestamoItem => {
      this.prestamoService.PutPrestamoFinanciera(prestamoItem._id, prestamo).subscribe(
        data => {
          actualizacionesCompletadas++;
          console.log(`Prestamo con ID ${prestamoItem._id} actualizado con éxito:`, data);
        },
        error => {
          errores++;
          console.log(`Error al actualizar el préstamo con ID ${prestamoItem._id}:`, error);
          alert(`Problemas al actualizar el préstamo con ID ${prestamoItem._id}. Intente más tarde.`);
        }
      );
    });
  }
  

  onFileSelected(event: any, tipo:any) {
    const file = event.target.files[0];

    if (file) {
      console.log("tipo en Seleccionar el archivo "+tipo);
      this.subirArchivo(file, tipo);
    }
  }

  compressImage(file: File, tipo:any) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const imageDataUrl = e.target.result;
      this.imageCompress
        .compressFile(imageDataUrl, -1, 50, 50) // Ajusta los valores según tus necesidades
        .then((result: any) => {
          // `result` contendrá la imagen comprimida en formato Blob
          // Convierte el Blob en un objeto File
          const compressedFile = new File([result], 'nombre_de_archivo.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          // Ahora puedes llamar a tu servicio de subida a la API
          // y pasar `compressedFile` como la imagen a subir
          console.log("tipo en comprimir  "+tipo);
          this.subirArchivo(compressedFile, tipo);
        });
    };

    reader.readAsDataURL(file);
  }

  openDialogInfo(mensaje: string, imagen:string): void {
    this.dialog.open(InfoDialogComponent, {
      width: '300px',  // Ajusta el ancho según sea necesario
      data: {
        message: mensaje,
        imageUrl: imagen  // Ruta de la imagen que quieres mostrar
      },
      disableClose: true // Deshabilita el cierre al hacer clic fuera del diálogo
    });
  }

  openDialog(){
    const dialogRef = this.matDialog.open(ConfirmacionComponent,{
      data: { parametro_id: this.mongoIdCliente },
      width:'250px',
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Si se ejecuto el despues de cerrar");
      if (result === 'confirmar') {
        console.log("Si devolvio el confirmar");
        this.eliminarCliente(this.mongoIdCliente);
        // Si se confirma la eliminación, vuelve a cargar la lista
      }
   
    });
  }

  subirArchivo(file: File, tipo: any) {
    console.log("tipo en subir archivo " + tipo);
    const nombreArchivo = this.numeroDeClienteID + '_' + tipo;
    const _sucursalFinanciera = this.sharedService.getFinanciera() ?? 'vacio';

    if (file) {
      this.subiendoArchivo = true; // Mostrar la barra de progreso
      this.progreso = 0; // Reiniciar el progreso

      this.uploadService.uploadUpdateFile2(file, this.mongoIdCliente, 'clientes', _sucursalFinanciera, 'clientes', nombreArchivo, tipo, (progress: number) => {
        this.progreso = progress;  // Actualizar el progreso
      }).then((response) => {
        console.log("Documento subido");
        console.log(response);
        this.imgMostrar="";
        this.subiendoArchivo = false; // Ocultar la barra de progreso
        this.imgMostrar= response.fotoPerfil;
        this.openDialogInfo("La imagen se subio exitosamente", "assets/img/exito.png");
      }).catch((error) => {
        console.error('Error al cargar el archivo:', error);
        this.subiendoArchivo = false; // Ocultar la barra de progreso
        this.openDialogInfo("No se pudo subir la imagen", "assets/img/error.png");
      });
    }
  }

  verificarCamposOpcionales(){
    // Verificar los campos opcionales y asignar valores por defecto si están vacíos
    const camposOpcionalesTexto = ['senasDomicilio', 'entreCalles', 'telefonoFijo', 'telefonoAdicional', 
    'tiempoVivienda', 'pagoRenta', 'tiempoNegocio', 'trabajoConyugue', 'domicilioConyugue', 'antiguedadConyugue'];

    camposOpcionalesTexto.forEach((campo) => {
     const campoControl = this.form?.get(campo);
     if (campoControl && !campoControl.value) {
       campoControl.setValue('SN');
     }
   });
   
   const camposOpcionalesNumeros = ['ingresosConyugue', 'creditosActuales'];

   camposOpcionalesNumeros.forEach((campo) => {
    const campoControl = this.form?.get(campo);
    if (campoControl && !campoControl.value) {
      campoControl.setValue(0);
    }
    });
  }


  openInput(){ 
    document.getElementById("fileInput")!.click();
  }
  openInput2(){ 
    document.getElementById("fileInput2")!.click();
  }
  openInput3(){ 
    document.getElementById("fileInput3")!.click();
  }
  openInput4(){ 
    document.getElementById("fileInput4")!.click();
  }
  openInput5(){ 
    document.getElementById("fileInput5")!.click();
  }


  eliminarAcentos2(n: any){
    return n.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
  }




  eliminarCliente(_id: any){
    this.clienteService.DeleteClienteFinanciera(_id).subscribe(data => {
      if(data){
        console.log(data);
        alert("Cliente Eliminado Satisfactoriamente");
        this.router.navigate(['dashboard/clientes']);
      }
    }, (error: any) => {
      console.log(error);
    });
  }

}

