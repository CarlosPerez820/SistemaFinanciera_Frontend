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
  form: FormGroup;
  numeroDeClienteID: any;
  mongoIdCliente: any;
  activo = false;
  lista2:any = [];
  clienteEspecifico: any = [];
  
  viviendas: any[] = [
    {value: 'Propia', viewValue: 'Propia'},
    {value: 'Rentada', viewValue: 'Rentada'},
    {value: 'Familiar', viewValue: 'Familiar'},
  ];


  constructor(private fb: FormBuilder, private gestorService: GestorServiceService, private sharedService: SharedService,
              private clienteService: ClienteServiceService, private route: ActivatedRoute,
              private imageCompress: NgxImageCompressService, private uploadService: UploadService,
              private matDialog: MatDialog,  private router: Router)
              {
    this.form = this.fb.group({
      numeroCliente: ['',Validators.required],
      nombreSolicitante: ['',Validators.required],
      edad: ['',Validators.required],
      direccion: ['',Validators.required],
      colonia: ['',Validators.required],
      senasDomicilio: [''],
      entreCalles: [''],
      ciudad: ['',Validators.required],
      celular: ['',Validators.required],
      telefonoFijo: [''],
      telefonoAdicional: [''],
      estadoCivil: ['',Validators.required],
      tiempoCasados: ['',Validators.required],
      dependientes: ['',Validators.required],
      tipoVivienda: ['',Validators.required],
      tiempoVivienda: [''],
      pagoRenta: [''],
      tipoNegocio: ['',Validators.required],
      tiempoNegocio: [''],
      numeroINE: ['',Validators.required],
      RFC: ['',Validators.required],
      conyugue: ['',Validators.required],
      trabajoConyugue: [''],
      domicilioConyugue: [''],
      antiguedadConyugue: [''],
      ingresoSolicitante: ['',Validators.required],
      ingresosConyugue: [''],
      gastos: ['',Validators.required],
      creditosActuales: [''],
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
      this.llenarFormulario();
    })
  }

  llenarFormulario(){
    console.log(this.clienteEspecifico.nombre);
    this.form.patchValue({
      numeroCliente: this.clienteEspecifico.numeroCliente,
      nombreSolicitante: this.clienteEspecifico.nombre,
      edad: this.clienteEspecifico.edad,
      direccion:  this.clienteEspecifico.direccion,
      colonia:  this.clienteEspecifico.colonia,
      senasDomicilio:  this.clienteEspecifico.senasDomicilio,
      ciudad:  this.clienteEspecifico.ciudad,
      celular:  this.clienteEspecifico.celular,
      telefonoFijo:  this.clienteEspecifico.telefonoFijo,
      telefonoAdicional:  this.clienteEspecifico.telefonoAdicional,
      estadoCivil:  this.clienteEspecifico.estadoCivil,
      tiempoCasados:  this.clienteEspecifico.tiempoCasados,
      dependientes:  this.clienteEspecifico.dependientes,
      tipoVivienda:  this.clienteEspecifico.tipoVivienda,
      tiempoVivienda:  this.clienteEspecifico.tiempoViviendo,
      pagoRenta:  this.clienteEspecifico.pagoRenta,
      tipoNegocio:  this.clienteEspecifico.tipoNegocio,
      tiempoNegocio:  this.clienteEspecifico.tiempoNegocio,
      numeroINE:  this.clienteEspecifico.numeroIdentificacion,
      RFC:  this.clienteEspecifico.RFC,
      conyugue:  this.clienteEspecifico.nombreConyugue,
      trabajoConyugue:  this.clienteEspecifico.trabajoConyugue,
      domicilioConyugue:  this.clienteEspecifico.domicilioConyugue,
      antiguedadConyugue:  this.clienteEspecifico.antiguedadConyugue,
      ingresoSolicitante:  this.clienteEspecifico.ingresoSolicitante,
      ingresosConyugue:  this.clienteEspecifico.ingresoConyugue,
      gastos:  this.clienteEspecifico.gastosTotales,
      creditosActuales:  this.clienteEspecifico.numeroPrestamos,
      gestor:  this.clienteEspecifico.gestorAsignado
    });
  }

  EnviarDatos(){
    this.editarUsuario();
  }

  editarUsuario(){
      this.verificarCamposOpcionales();

    const cliente: Clientes = {
      nombre: this.eliminarAcentos2(this.form.value.nombreSolicitante),
      edad: this.form.value.edad,
      direccion: this.form.value.direccion,
      colonia: this.form.value.colonia,
      senasDomicilio: this.form.value.senasDomicilio,
      ciudad: this.form.value.ciudad,
      celular: this.form.value.celular,
      telefonoFijo: this.form.value.telefonoFijo,
      telefonoAdicional: this.form.value.telefonoAdicional,
      estadoCivil: this.form.value.estadoCivil,
      tiempoCasados: this.form.value.tiempoCasados,
      dependientes: this.form.value.dependientes,
      tipoVivienda: this.form.value.tipoVivienda,
      tiempoViviendo: this.form.value.tiempoVivienda,
      pagoRenta: this.form.value.pagoRenta,
      tipoNegocio: this.form.value.tipoNegocio,
      tiempoNegocio: this.form.value.tiempoNegocio,
      numeroIdentificacion: this.form.value.numeroINE,
      RFC: this.form.value.RFC,
      nombreConyugue: this.form.value.conyugue,
      trabajoConyugue: this.form.value.trabajoConyugue,
      domicilioConyugue: this.form.value.domicilioConyugue,
      antiguedadConyugue: this.form.value.antiguedadConyugue,
      ingresoSolicitante: this.form.value.ingresoSolicitante,
      ingresoConyugue: this.form.value.ingresosConyugue,
      gastosTotales: this.form.value.gastos,
      gestorAsignado: this.form.value.gestor,
    }
    console.log(cliente);

    this.clienteService.PutClienteFinanciera(this.mongoIdCliente, cliente).subscribe(data => {
      if(data){
        console.log(data);
        alert("Cliente Actualizado");
      }
    }, (error: any) => {
      console.log(error);
      alert("Problemas al actualizar, intente mas tarde");
    })
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

  subirArchivo(file: File, tipo:any){
    console.log("tipo en subir archivo "+this.numeroDeClienteID);
    const nombreArchivo = this.mongoIdCliente+'_'+tipo;
    const _sucursalFinanciera = this.sharedService.getFinanciera()??'vacio';

    if (file) {
      this.uploadService.uploadUpdateFile(file,this.mongoIdCliente,'clientes',_sucursalFinanciera,'clientes',nombreArchivo,tipo).then((response) => {
       // console.log('Archivo cargado con éxito ('+tipo+'):', response);
        console.log("Documento subido");
        console.log(response);
       // Realiza acciones adicionales después de la carga exitosa
       alert("Se subio el archivo correctamente");
      }).catch((error) => {
        console.error('Error al cargar el archivo:', error);
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

  eliminarAcentos2(n: any){
    return n.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
  }


  openDialog(){
    const dialogRef = this.matDialog.open(ConfirmacionComponent,{
      data: { parametro_id: this.mongoIdCliente },
      width:'250px',
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

