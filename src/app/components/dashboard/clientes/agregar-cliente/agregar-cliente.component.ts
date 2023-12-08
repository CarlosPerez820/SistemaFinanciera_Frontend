import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Clientes } from 'src/app/interfaces/clientes';
import { Gestor } from 'src/app/interfaces/gestor';
import { ClienteServiceService } from 'src/app/services/cliente-service.service';
import { GestorServiceService } from 'src/app/services/gestor-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { UploadService } from 'src/app/services/upload.service';

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
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.css']
})
export class AgregarClienteComponent {

  //Vaiables Globales
  fecha_Solicitud: string =fechaDia;
  lista: any =[];
  listaGestores: Gestor[] = [];
  form: FormGroup;
  numeroDeClienteID: any;
  mongoIdCliente: any;
  activo = false;
  lista2:any = [];
  listaDeInteres: any = [];
  
  viviendas: any[] = [
    {value: 'Propia', viewValue: 'Propia'},
    {value: 'Rentada', viewValue: 'Rentada'},
    {value: 'Familiar', viewValue: 'Familiar'},
  ];


  constructor(private fb: FormBuilder, private gestorService: GestorServiceService, private sharedService: SharedService,
              private clienteService: ClienteServiceService, 
              private imageCompress: NgxImageCompressService, private uploadService: UploadService)
              {
    this.form = this.fb.group({
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

  EnviarDatos(){
    this.agregarUsuario();
  }

  agregarUsuario(){
      this.verificarCamposOpcionales();

     this.numeroDeClienteID = this.eliminarAcentos2(this.form.value.nombreSolicitante).substring(0, 2)+year+month+day+hour+minutes+segundes;

    const cliente: Clientes = {
      numeroCliente: this.numeroDeClienteID,
      nombre: this.eliminarAcentos2(this.form.value.nombreSolicitante),
      edad: this.form.value.edad,
      direccion: this.form.value.direccion,
      colonia: this.form.value.colonia,
      senasDomicilio: this.form.value.senasDomicilio,
      entrecalles: this.form.value.entreCalles,
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
      fotoComprobante: "URL",
      fotoFachada: "URL",
      fotoIneFrente: "URL",
      fotoIneReverso: "URL",
      tipo: "SN",
      fechaRegistro: this.fecha_Solicitud,
      numeroPrestamos: this.form.value.creditosActuales,
      numeroActivos: 0,
      prestamosActivos:false,
      clasificacion:"Pendiente",
      sucursal: this.sharedService.getFinanciera()
    }
    console.log(cliente);

    this.clienteService.guardarCliente(cliente).subscribe(
      (response) => {
      console.log('Cliente registrado con éxito:');
      console.log(response);
       const _idCliente = response.cliente._id;
       console.log("El id del nuevo cliente es "+_idCliente);
       this.mongoIdCliente = _idCliente;
       this.activo=true;
    },
    (error) => {
      console.error('Error al registrar cliente:', error);
    });
  }

  onFileSelected(event: any, tipo:any) {
    const file = event.target.files[0];

    if (file) {
      console.log("tipo en Seleccionar el archivo "+tipo);
      this.compressImage(file, tipo);
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
    console.log("tipo en subir archivo "+tipo);
    const nombreArchivo = this.numeroDeClienteID+'_'+tipo;
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

}
