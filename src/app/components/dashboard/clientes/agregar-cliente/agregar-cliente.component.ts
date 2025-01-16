import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxImageCompressService } from 'ngx-image-compress';
import { InfoDialogComponent } from 'src/app/components/info-dialog/info-dialog.component';
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

  isLoading = false;

  //barra de progeso
  subiendoArchivo: boolean = false; // Controla la visibilidad de la barra de progreso
  progreso: number = 0; // Valor de progreso para la barra
  
  
  viviendas: any[] = [
    {value: 'Propia', viewValue: 'Propia'},
    {value: 'Rentada', viewValue: 'Rentada'},
    {value: 'Familiar', viewValue: 'Familiar'},
  ];


  constructor(private fb: FormBuilder, private gestorService: GestorServiceService, private sharedService: SharedService,
              private clienteService: ClienteServiceService,  private dialog: MatDialog,
              private imageCompress: NgxImageCompressService, private uploadService: UploadService)
              {
    this.form = this.fb.group({
      nombreSolicitante: ['',Validators.required],
      direccion: ['',Validators.required],
      colonia: ['',Validators.required],
      ciudad: ['',Validators.required],
      celular: ['',Validators.required],
      estadoCivil: ['',Validators.required],
      tipoVivienda: ['',Validators.required],
      tiempoVivienda: [''],
      pagoRenta: [''],
      tiempoNegocio: [''],
      numeroINE: ['',Validators.required],
      RFC: ['',Validators.required],
      conyugue: ['',Validators.required],
      ingresoSolicitante: ['',Validators.required],
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
    if (this.isLoading) {
      return;  
    }
    this.isLoading = true; 

    this.verificarCamposOpcionales();

    this.numeroDeClienteID = this.eliminarAcentos2(this.form.value.nombreSolicitante).substring(0, 2)+year+month+day+hour+minutes+segundes;

    const cliente: Clientes = {
      numeroCliente: this.numeroDeClienteID,
      nombre: this.eliminarAcentos2(this.form.value.nombreSolicitante),
      edad: "desabilitado",
      direccion: this.form.value.direccion,
      colonia: this.form.value.colonia,
      senasDomicilio: "desabilitado",
      entrecalles:"desabilitado",
      ciudad: this.form.value.ciudad,
      celular: this.form.value.celular,
      telefonoFijo: "desabilitado",
      telefonoAdicional: "desabilitado",
      estadoCivil: this.form.value.estadoCivil,
      tiempoCasados: "desabilitado",
      dependientes: "desabilitado",
      tipoVivienda: this.form.value.tipoVivienda,
      tiempoViviendo: this.form.value.tiempoVivienda,
      pagoRenta: this.form.value.pagoRenta,
      tipoNegocio:"desabilitado",
      tiempoNegocio: this.form.value.tiempoNegocio,
      numeroIdentificacion: this.form.value.numeroINE,
      RFC: this.form.value.RFC,
      nombreConyugue: this.form.value.conyugue,
      trabajoConyugue: "desabilitado",
      domicilioConyugue: "desabilitado",
      antiguedadConyugue: "desabilitado",
      ingresoSolicitante: this.form.value.ingresoSolicitante,
      ingresoConyugue: 0,
      gastosTotales: 0,
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
      adeudo: 0,
      puntuacion:'0',
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
       this.isLoading = false; 
    },
    (error) => {
      console.error('Error al registrar cliente:', error);
      this.isLoading = false; 
      this.openDialog("Lo sentimos ocurrio un problema y no se pudo registrar", "assets/img/exito.png");
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
        this.subiendoArchivo = false; // Ocultar la barra de progreso
        this.openDialog("La imagen se subio exitosamente", "assets/img/exito.png");
      }).catch((error) => {
        console.error('Error al cargar el archivo:', error);
        this.subiendoArchivo = false; // Ocultar la barra de progreso
        this.openDialog("No se pudo subir la imagen", "assets/img/error.png");
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

}
