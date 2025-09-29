import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Pago } from 'src/app/interfaces/pago';
import { GestorServiceService } from 'src/app/services/gestor-service.service';
import { PrestamoServiceService } from 'src/app/services/prestamo-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { PagoServiceService } from 'src/app/services/pago-service.service';
import { Prestamo } from 'src/app/interfaces/prestamo';
import { Clientes } from 'src/app/interfaces/clientes';
import { ClienteServiceService } from 'src/app/services/cliente-service.service';
import { InfoDialogComponent } from 'src/app/components/info-dialog/info-dialog.component';
import { MatDialog } from '@angular/material/dialog';

import { environment } from 'src/environments/environment';
import { UploadService } from 'src/app/services/upload.service';
import { ConfirmacionComponent } from '../../informe-rutas/confirmacion/confirmacion.component';
import { ParametroServiceService } from 'src/app/services/parametro-service.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TasasService } from 'src/app/services/tasas.service';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

const url_server = environment.url+"/";

//Obtener datos de fecha y hora
var today = new Date();
var day = today.getDate();
var month = today.getMonth() + 1;
var year = today.getFullYear();
var hour = today.getHours();
var minutes =  today.getMinutes();
var segundes =  today.getSeconds();
var mili = today.getMilliseconds();

// muestra la fecha de hoy en formato `MM/DD/YYYY`
var fechaDia = `${day}-${month}-${year}`;

@Component({
  selector: 'app-registro-pago',
  templateUrl: './registro-pago.component.html',
  styleUrls: ['./registro-pago.component.css']
})
export class RegistroPagoComponent {

  fecha_Solicitud: string =fechaDia;
  totalRestante: any;
  panelOpenState = false;

  form: FormGroup;
  mongoIdPrestamo:any;
  lista: any =[];
  listaGestores: any =[];
  lista2: any = [];
  prestamoEspecifico: any =[];
  lista3: any =[];
  listaPagos:any =[];
  listaPagosFormal : Pago[] = [];
  fotoPefil = "";

  lista4:any=[];
  clienteEspecifico:any=[];

  isLoading = false;

  variableURL = url_server;

  //Nuevas variables para logica de pagos
  numeroPago=0;
  extraPago=0;
  adeudoPago=0;
  adeudoTotal = 0;
  saldoExtra = 0;
  puntuacion = 0;
  morasPrestamo = 0;
  adeudoCliente = 0;
  adeudoNegativo = 0;
  
  //Nuevas variables para el PDF
  listaParametros:any=[];
  lista5:any=[];
  imageURL: string = 'http&rs=1';
  pdfFileName: string = 'mi_pdf';

     
  onSemanal = false;
  listaInteres: any;
  tasaSemanal: any[] = [];
  plazoSemanal: any[] = [];
  tasaSeleccionada: any;
  onBonificacion = false;
  tasasTradicional: any[] = [];
  NuevoMonto = 0;
  dotacionVar = 0;

  //ProximoPagoVariable
  proximoPagoVar: any;

  //barra de progeso
  subiendoArchivo: boolean = false; // Controla la visibilidad de la barra de progreso
  progreso: number = 0; // Valor de progreso para la barra

  viviendas: any[] = [
    {value: 'Propia', viewValue: 'Propia'},
    {value: 'Rentada', viewValue: 'Rentada'},
    {value: 'Familiar', viewValue: 'Familiar'},
  ];

  metodos: any[] = [
    {value: 'Efectivo', viewValue: 'Efectivo'},
    {value: 'Transferencia', viewValue: 'Transferencia'},
  ];

  tiposPago: any[] = [
    {value: 'Adelantar', viewValue: 'Adelantar'},
    {value: 'Liquidar', viewValue: 'Liquidar'},
    {value: 'Extra', viewValue: 'Usar Extra'},

  ];

  constructor(private fb: FormBuilder,  private route: ActivatedRoute, private gestorService: GestorServiceService, 
              private prestamoService: PrestamoServiceService, private sharedService: SharedService, private pagoService:PagoServiceService,
              private router: Router, private clienteService:ClienteServiceService, private dialog:MatDialog,
              private uploadService: UploadService, private parametroService: ParametroServiceService, private http: HttpClient,
              private tasasService: TasasService,){
    this.form = this.fb.group({
      totalRestante: ['',Validators.required], 
      metodo: ['Efectivo',Validators.required],    
      tipoPago:['Liquidar', Validators.required],       
      montoPagado: ['',Validators.required],      
      numeroCliente: ['',Validators.required],
      montoAutorizado: ['',Validators.required],
      totalPagar: ['',Validators.required],
      pagoDiario: ['',Validators.required],
      plazo: ['',Validators.required],
      nombreSolicitante: ['',Validators.required],
      direccion: ['',Validators.required],
      colonia: ['',Validators.required],
      celular: ['',Validators.required], 
      gestor: ['',Validators.required],

      direccionNegocio:[''],
      telefonoAdicional:['']
    })
  }

  ngOnInit(): void{
    this.mongoIdPrestamo = this.route.snapshot.paramMap.get("id");
    console.log(this.mongoIdPrestamo);
    this.obtenerGestores();
    this.obtenerPrestamo();
    this.obtenerParametos();
  }

  bonificacion(){
    this.onBonificacion=true;

    this.tasasTradicional = this.tasasService.getTasasTradicional();
  }

  aplicarBonificacion(){
    this.form.patchValue({

      montoPagado: this.dotacionVar,
      tipoPago: 'Liquidar'});

      this.registrarPagos('Bonificacion');
  }

  onPlazoChange(){
    console.log("gola");
    console.log(this.tasaSeleccionada);

    let total=0;
    let interes = this.tasaSeleccionada.interes;
    let montoNumber =this.form.value.montoAutorizado;

    //console.log(plazoNumber);

    total = Math.round((montoNumber * interes)/100)+montoNumber;
    this.NuevoMonto = total;
    this.dotacionVar = this.form.value.totalPagar - this.NuevoMonto;
  }

  obtenerParametos(){
    this.parametroService.getParametrosFinanciera(this.sharedService.getFinanciera()).subscribe(
      (data) => {
        this.lista5 = data;
        this.listaParametros = this.lista5.parametros;
       // console.log(this.listaParametros);
      },
      (error) => {
        console.error('Error al obtener la lista de los parametros:', error);
      });
  }

  

  generarFolioPago(tipo: string) {
    const now = new Date();

    // Formatea día, mes, hora, minutos y segundos para que siempre tengan dos dígitos
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hour = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const mili = now.getMilliseconds();

    // Crear el folio de pago
    const folioPago = `${tipo}-${year}${month}${day}${hour}${minutes}${seconds}${mili}`;
    
    // Crear la hora actual en formato HH:MM
    const _horaActual = `${hour}:${minutes}`;

    return { folioPago, _horaActual };
}

  registrarPagos(tipoPago: string){
    if (this.isLoading) {
      return;  
    }
    this.isLoading = true;  

    let pagoDiario = this.prestamoEspecifico.pagoDiario;
    this.morasPrestamo = this.prestamoEspecifico.moras;
    let numeroDePago = this.prestamoEspecifico.numeroPago;
    let aCubrir = this.prestamoEspecifico.totalRestante;
    let cantidadPagada = this.form.value.montoPagado;
    let tipo = this.form.value.tipoPago;
    let saldo = 0;
    let extra = this.prestamoEspecifico.saldoExtra
    let tipoMovimiento = tipoPago;

    if(this.prestamoEspecifico.numeroPago == 0){
      numeroDePago = 1;
    }
    else if(this.prestamoEspecifico.fechaPago!=this.fecha_Solicitud){
      numeroDePago = numeroDePago+1;
    }

    if(tipo=="Liquidar"){
      saldo = aCubrir - cantidadPagada;
    }
    else if(tipo=="Adelantar"){
      if(cantidadPagada>pagoDiario){
        
        extra = extra+(cantidadPagada-pagoDiario);
        cantidadPagada = pagoDiario;
        saldo = aCubrir - cantidadPagada;
      }
      else{
        this.isLoading = false;  
        alert("Cantidad insufiente para adelantar");
        return;
      }
    }
    else if(tipo=="Extra"){
      cantidadPagada = cantidadPagada + extra;
      saldo = aCubrir - cantidadPagada;
      extra = 0;
    }



    this.totalRestante = saldo;
    this.numeroPago = numeroDePago;
    this.saldoExtra = extra;

    const { folioPago, _horaActual } = this.generarFolioPago('PAG');

    //Aqui inicia el registro del pago en la base de datos
    const pago: Pago ={
      fecha: this.fecha_Solicitud,
      folio: folioPago,
      nombreCliente: this.prestamoEspecifico.nombre,
      numCliente: this.prestamoEspecifico.numeroCliente,
      cobranza: 0,
      cantidadPrestamo: this.prestamoEspecifico.cantidadPrestamo,
      plazo: this.prestamoEspecifico.plazoPrestamo,
      totalPagar: this.prestamoEspecifico.cantidadPagar,
      totalRestante: saldo,
      pagoDiario: this.prestamoEspecifico.pagoDiario,
      folioPrestamo: this.prestamoEspecifico.folio,
      fechaPago: this.fecha_Solicitud,
      horaPago: _horaActual,
      gestor: this.form.value.gestor,
      tipo: tipoMovimiento,
      comentario: 'Vacio',
      abono: cantidadPagada,
      personasCobrador: 'Oficina',
      
      estado: 'general',
      numeroPago: numeroDePago,
      adeudo: aCubrir, //a cubrir
      pagosPendiente: 0,
      mora:0,
      extra:0,
      saldoExtra: this.saldoExtra,
      real: 0,
      metodo: this.form.value.metodo,
      sucursal: this.sharedService.getFinanciera(),
    }


    this.pagoService.postPago(pago).subscribe(
      (response) => {
      this.actualizarPrestamo();
      this.actualizarCliente();

      this.openDialog("Pago registrado con éxito", "assets/img/exito.png");

      if(this.sharedService.getFinanciera()!==this.sharedService.getSucursalCliente()){
        this.avisoSMS();
      }

      this.form.reset();

      this.router.navigateByUrl('/dummyRoute', { skipLocationChange: true }).then(() => {
        this.router.navigate(['dashboard/prestamos']);
      });
    },
    (error) => {
      console.error('Error al registrar Pago:', error);
      alert("Hay problemas al registrar el pago");
      this.router.navigateByUrl('/dummyRoute', { skipLocationChange: true }).then(() => {
        this.router.navigate(['dashboard/prestamos']);
      });
    });
  }

  buscarCliente(){
    this.clienteService.getClientesPorNumeroFinanciera(this.sharedService.getFinanciera(), this.prestamoEspecifico.numeroCliente)
    .subscribe( data => {
      //console.log(data);
      this.lista4 = data;
      this.clienteEspecifico = this.lista4.clientes;
    //  console.log("CLinete:---");
    //  console.log(this.clienteEspecifico);
      this.fotoPefil = this.clienteEspecifico[0].fotoPerfil;
      this.puntuacion = Number(this.clienteEspecifico[0].puntuacion);
      this.adeudoCliente = this.clienteEspecifico[0].adeudo;
    })
  }

  actualizarCliente(){
    let activos=this.clienteEspecifico[0].numeroActivos;

    if(this.totalRestante<=0){
      activos=activos-1;
    }

    const cliente: Clientes={
      puntuacion: this.puntuacion.toString(),
      numeroActivos: activos,
      //adeudo: this.adeudoCliente,
    }
    this.clienteService.PutClienteFinanciera(this.clienteEspecifico[0]._id, cliente).subscribe(data => {
      if(data){

      }
    }, (error: any) => {
      alert("Problemas al actualizar al cliente, intente mas tarde");
    });
  }

    actualizarClienteMora(){

    const cliente: Clientes={
      puntuacion: (this.puntuacion + 1).toString(),
    }
    this.clienteService.PutClienteFinanciera(this.clienteEspecifico[0]._id, cliente).subscribe(data => {
      if(data){

      }
    }, (error: any) => {
      alert("Problemas al actualizar al cliente, intente mas tarde");
    });
  }

  finalizar(){
    const prestamo: Prestamo = {
      fechaPago: this.fecha_Solicitud,
      estatus: 'Finalizado',
    }

    let activos=this.clienteEspecifico[0].numeroActivos;

    const cliente: Clientes={
      numeroActivos: activos-1,
    }

    this.clienteService.PutClienteFinanciera(this.clienteEspecifico[0]._id, cliente).subscribe(data => {
      if(data){
      //  console.log(data);
      }
    }, (error: any) => {
    //  console.log(error);
      alert("Problemas al actualizar al cliente, intente mas tarde");
    });

    this.prestamoService.PutPrestamoFinanciera(this.mongoIdPrestamo, prestamo).subscribe(data => {
      if(data){
        console.log(data);
        this.router.navigateByUrl('/dummyRoute', { skipLocationChange: true }).then(() => {
          this.router.navigate(['dashboard/prestamos']);
        });
      }
    }, (error: any) => {
      console.log(error);
      alert("Problemas al actualizar el prestamo, intente mas tarde");
    });
  }

  calcularProximoPago(): string {
    //let fechaInicia: Date = new Date(this.fecha_Solicitud); 
    const [d, m, a] = this.proximoPagoVar.split('-').map(Number);
    const ultimaFechaPago = new Date(a, m - 1, d);

    const proximoPago = new Date(ultimaFechaPago);
    proximoPago.setDate(ultimaFechaPago.getDate() + 7);

    const dia = proximoPago.getDate();
    const mes = proximoPago.getMonth() + 1;
    const anio = proximoPago.getFullYear();

    const fechaFormateada = `${dia}-${mes}-${anio}`;

    return fechaFormateada;
  }

  actualizarPrestamo(){
    let pagoSiguiente='Diario';

    let estatusPrestamo = "Activo";
    if(this.totalRestante<=0){
      estatusPrestamo="Finalizado";
   
    }

    if(this.prestamoEspecifico.tipoPrestamo=="semanal"){
      pagoSiguiente = this.calcularProximoPago();
    }

    const prestamo: Prestamo = {
      fechaPago: this.fecha_Solicitud,
      totalRestante:this.totalRestante,
      estatus: estatusPrestamo,
      tipoUltiPago: 'Pago',

      numeroPago: this.numeroPago,
      saldoExtra: this.saldoExtra,
      proximoPago: pagoSiguiente
    }

    this.prestamoService.PutPrestamoFinanciera(this.mongoIdPrestamo, prestamo).subscribe(data => {
      if(data){
        console.log(data);
      }
    }, (error: any) => {
      console.log(error);
      alert("Problemas al actualizar el prestamo, intente mas tarde");
    });
  }

  actualizarPrestamoMora(){
    const prestamo: Prestamo = {
      fechaPago: this.fecha_Solicitud,
      totalRestante:this.totalRestante,
      tipoUltiPago: 'Mora',

      numeroPago: this.numeroPago,
      saldoExtra: this.saldoExtra,
      moras: this.morasPrestamo + 50
    }

    this.prestamoService.PutPrestamoFinanciera(this.mongoIdPrestamo, prestamo).subscribe(data => {
      if(data){
        console.log(data);
      }
    }, (error: any) => {
      console.log(error);
      alert("Problemas al actualizar el prestamo, intente mas tarde");
    });
  }

  obtenerPagos(){
    this.pagoService.getPagosPrestamo(this.sharedService.getFinanciera(), this.prestamoEspecifico.folio)
    .subscribe( data => {
      console.log(data);
      this.lista3 = data;
      this.listaPagos = this.lista3.pagos;
      this.listaPagosFormal = this.listaPagos;
      //console.log(this.listaPagos);
    })
  }

  obtenerGestores(){
    this.gestorService.getGestorFinanciera(this.sharedService.getFinanciera())
    .subscribe( data => {
      //console.log(data);
      this.lista = data;
      this.listaGestores = this.lista.gestores;
     // console.log(this.listaGestores);
    })
  }

  obtenerPrestamo(){
    this.prestamoService.getPrestamoEspecifico(this.mongoIdPrestamo)
    .subscribe( data => {
      console.log(data);
      this.lista2 = data;
      this.prestamoEspecifico = this.lista2.prestamo;
      console.log("Este es el prestamo especifico");
      console.log(this.prestamoEspecifico);
      this.llenarFormulario();
      this.obtenerPagos();
      this.buscarCliente();

      this.numeroPago=this.prestamoEspecifico.numeroPago;
      this.adeudoTotal = this.prestamoEspecifico.adeudo;
      this.saldoExtra = this.prestamoEspecifico.saldoExtra;
      this.morasPrestamo = this.prestamoEspecifico.moras;
      this.totalRestante = this.prestamoEspecifico.totalRestante;
      this.proximoPagoVar = this.prestamoEspecifico.proximoPago;
    })
  }

  llenarFormulario(){
    //console.log(this.prestamoEspecifico.nombre);
    this.form.patchValue({
      totalRestante: this.prestamoEspecifico.totalRestante,
      numeroCliente: this.prestamoEspecifico.numeroCliente,
      fecha: this.prestamoEspecifico.fecha,
      montoAutorizado: this.prestamoEspecifico.cantidadPrestamo,
      totalPagar: this.prestamoEspecifico.cantidadPagar,
      pagoDiario: this.prestamoEspecifico.pagoDiario,
      plazo: this.prestamoEspecifico.plazoPrestamo,
      nombreSolicitante:this.prestamoEspecifico.nombre,
      direccion: this.prestamoEspecifico.direccion,
      colonia: this.prestamoEspecifico.colonia,
      celular: this.prestamoEspecifico.telefono, 
      gestor: this.prestamoEspecifico.gestor,
      direccionNegocio: this.prestamoEspecifico.direccionNegocio,
      telefonoAdicional: this.prestamoEspecifico.telefonoAdicional
    });
  }

  agregarUsuario(){
   // console.log(this.form);
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

  openDialog2(){
    const dialogRef = this.dialog.open(ConfirmacionComponent,{
      data: { parametro_id: 'abc' },
      width:'250px',
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("Si se ejecuto el despues de cerrar");
      if (result === 'confirmar') {
        //console.log("Si devolvio el confirmar");
        this.finalizar();
        // Si se confirma la eliminación, vuelve a cargar la lista
      }
   
    });
  }

  openInput(){ 
    document.getElementById("fileInput")!.click();
  }
  openInput2(){ 
    document.getElementById("fileInput2")!.click();
  }

  
  onFileSelected(event: any, tipo:any) {
    const file = event.target.files[0];

    if (file) {
      //console.log("tipo en Seleccionar el archivo "+tipo);
      this.subirArchivo(file, tipo);
    }
  }

  subirArchivo(file: File, tipo:any){
    //console.log("tipo en subir archivo "+tipo);
    const nombreArchivo = this.mongoIdPrestamo+'_'+tipo;
    const _sucursalFinanciera = this.sharedService.getFinanciera()??'vacio';

    if (file) {
      this.subiendoArchivo = true; // Mostrar la barra de progreso
      this.progreso = 0; // Reiniciar el progreso

      this.uploadService.uploadUpdateFile2(file, this.mongoIdPrestamo, 'prestamos', _sucursalFinanciera, 'prestamos', nombreArchivo,tipo, (progress: number) => {
        this.progreso = progress;  // Actualizar el progreso
      }).then((response) => {

        this.subiendoArchivo = false; // Ocultar la barra de progreso
        this.openDialog("La imagen se subio exitosamente", "assets/img/exito.png");
      }).catch((error) => {
        console.error('Error al cargar el archivo:', error);
        this.subiendoArchivo = false; // Ocultar la barra de progreso
        this.openDialog("No se pudo subir la imagen", "assets/img/error.png");
      });
    }
  }

  avisoSMS(){
    let texto="Hola "+ this.prestamoEspecifico.nombre + ", nos comunicamos de "+ this.prestamoEspecifico.sucursal + " para informarte que tu pago de $"+ 
    this.form.value.montoPagado+ "fue registrado exitosamente. Tu monto restante a pagar es de $"+this.totalRestante;

    let WhatsappNumero=this.form.value.celular;
    let codigoPais: string ="52";
    let urlWhats= "https://wa.me/"+ codigoPais+WhatsappNumero+"?text="+texto;
  
    
   // console.log("SMS....................." + urlWhats);
    window.open(urlWhats, "_blank"); // Abre en una nueva pestaña o ventana
  }

  imprimirHistorial(){

  }

  generarPDF() {
    console.log("Aqui viene la lista de pagos");
    console.log(this.listaPagos);
   // console.log("Generando PDF...");

    let nombreCliente = this.form.value.nombreSolicitante;
    let plazo = this.form.value.plazo;
    let pagoDiario = this.form.value.pagoDiario;
    let cantidadPrestamo = this.form.value.montoAutorizado;
    let cantidadPagar = this.form.value.totalPagar;

    try {
      if (this.listaParametros.length === 0) {
        this.openDialog("Es necesario subir primero su logo para generar un PDF", "assets/img/error.png");
        return; // Añadido: Salir del método si no hay logo
      }
  
  //    console.log(this.listaParametros);
  
      this.imageURL = url_server + this.listaParametros[0].urlLogo;
  
      // Realizar la solicitud HTTP para obtener la imagen
      this.http.get(this.imageURL, { responseType: 'blob' }).subscribe(
        (imageBlob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const imageBase64 = reader.result as string;
  
            // Contenido del PDF
          const documentDefinition = {
            pageOrientation: 'landscape' as 'landscape', // Asegúrate de usar el tipo específico
            content: [
              {
                text: "Cliente: " + nombreCliente + " - Historial Pagos "+ '\n' ,
                style: 'header',
                bold: true,
              },
              {
                text: "Prestamo Aprobado "+ this.prestamoEspecifico.tipoPrestamo +", de :$ " + cantidadPrestamo + " - con un total a pagar de $"+cantidadPagar+ '\n' ,
                style: 'header',
              },
              {
                text: "Plazo del prestamo: "+plazo + ", Pagos de: $"+ pagoDiario+ '\n' + '\n' +'\n' ,
                style: 'header',
              },
              {
                image: imageBase64,
                width: 200, // Ajusta el ancho de acuerdo a tus necesidades
                height: 140,
                absolutePosition: { x: 550, y: 5 }, // Ajusta las coordenadas para alinear en la esquina superior derecha
                opacity: 0.3, // Establece la opacidad (0 a 1)
              },
              {
                style: 'tableExample',
                table: {
                  body: [
                    ['Numero', 'Fecha', 'A cubrir', 'Pago', 'Mora', 'Extra', 'Saldo','Tipo' ,'Registrado por'],
                    ...this.listaPagos.map((payment: { 
                      numeroPago: any; 
                      fecha: any; 
                      adeudo: any;
                      abono:any;
                      mora: any;
                      saldoExtra: any;
                      totalRestante: any;
                      tipo:any;
                      personasCobrador: any;
                    }) => [
                      payment.numeroPago ?? 'N/A', // Valor por defecto para numeroPago
                      payment.fecha ?? 'N/A',        // Valor por defecto para fecha
                      '$' + (payment.adeudo ?? 0),     // Valor por defecto para recibido
                      '$' + (payment.abono ?? 0),    // Valor por defecto para registrado en pago
                      '$' + (payment.mora ?? 0),         // Valor por defecto para mora registrada
                      '$' + (payment.saldoExtra ?? 0), // Valor por defecto para total restante
                      '$' + (payment.totalRestante ?? 0),   // Valor por defecto para adeudo total
                      payment.tipo ?? 'N/A', // Valor por defecto para registrado por
                      payment.personasCobrador ?? 'N/A' // Valor por defecto para registrado por
                    ])
                  ]
                }
              },
            ],
            styles: {
              header: {
                fontSize: 18,
                bold: true,
              }
            }
          };
  
          // Generar el PDF
          const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
  
          // Descargar el PDF con el nombre ingresado
          const pdfFileName = nombreCliente + '_Historial_'+this.fecha_Solicitud;
          pdfDocGenerator.getBlob((blob) => {
            saveAs(blob, pdfFileName + '.pdf');
          });
        };          
          reader.readAsDataURL(imageBlob);
        },
        (error) => {
          console.error('Error al obtener la imagen:', error);
          alert("Hace falta su logo para crear su documento");
        }
      );
    } catch (error) {
      this.openDialog("Ocurrió un error, verifique que tenga una imagen." + error, "assets/img/error.png");
    }
  }


    registrarMora(tipoPago: string){
    if (this.isLoading) {
      return;  
    }
    this.isLoading = true;  

    this.morasPrestamo = this.prestamoEspecifico.moras;
    let numeroDePago = this.prestamoEspecifico.numeroPago;
    let aCubrir = this.prestamoEspecifico.totalRestante;
    let cantidadPagada = this.form.value.montoPagado;
    let saldo = 0;
    let extra = this.prestamoEspecifico.saldoExtra
    let tipoMovimiento = tipoPago;

    let cantidadMora = this.prestamoEspecifico.cobranza;

    if(this.prestamoEspecifico.numeroPago == 0){
      numeroDePago = 1;
    }
    else if(this.prestamoEspecifico.fechaPago!=this.fecha_Solicitud){
      numeroDePago = numeroDePago+1;
    }

    saldo = aCubrir + cantidadMora;

    this.totalRestante = saldo;
    this.numeroPago = numeroDePago;
    this.saldoExtra = extra;

    const { folioPago, _horaActual } = this.generarFolioPago('MOR');

    //Aqui inicia el registro del pago en la base de datos
    const pago: Pago ={
      fecha: this.fecha_Solicitud,
      folio: folioPago,
      nombreCliente: this.prestamoEspecifico.nombre,
      numCliente: this.prestamoEspecifico.numeroCliente,
      cobranza: this.prestamoEspecifico.cobranza,
      cantidadPrestamo: this.prestamoEspecifico.cantidadPrestamo,
      plazo: this.prestamoEspecifico.plazoPrestamo,
      totalPagar: this.prestamoEspecifico.cantidadPagar,
      
      totalRestante: saldo,

      pagoDiario: this.prestamoEspecifico.pagoDiario,
      folioPrestamo: this.prestamoEspecifico.folio,
      fechaPago: this.fecha_Solicitud,
      horaPago: _horaActual,
      gestor: this.form.value.gestor,
      tipo: tipoMovimiento,
      comentario: 'Vacio',
      abono: 0,
      personasCobrador: 'Oficina',
      
      estado: 'general',
      numeroPago: numeroDePago,

      adeudo: aCubrir, //a cubrir

      pagosPendiente: 0,
      mora:cantidadMora,
      extra:0,
      saldoExtra: this.saldoExtra,
      real: 0,
      metodo: 'Digital',
      sucursal: this.sharedService.getFinanciera(),
    }


    this.pagoService.postPago(pago).subscribe(
      (response) => {
      this.openDialog("Mora Aplicada con éxito", "assets/img/exito.png");

      this.actualizarPrestamoMora();
        this.actualizarClienteMora();

      if(this.sharedService.getFinanciera()!==this.sharedService.getSucursalCliente()){
        this.avisoSMS();
      }

      this.form.reset();

      this.router.navigateByUrl('/dummyRoute', { skipLocationChange: true }).then(() => {
        this.router.navigate(['dashboard/prestamos']);
      });
    },
    (error) => {
      console.error('Error al registrar Pago:', error);
      alert("Hay problemas al registrar el pago");
      this.router.navigateByUrl('/dummyRoute', { skipLocationChange: true }).then(() => {
        this.router.navigate(['dashboard/prestamos']);
      });
    });
  }
  

}



/*registrarPagosAntiguo(){
  if (this.isLoading) {
    return;  
  }
  this.isLoading = true;  

  let estadoPago = "Completo"; //completo-incompleto-extra
  let abonoActual = Number(this.form.value.montoPagado);
  let abonoEsperado = Number(this.prestamoEspecifico.pagoDiario);
  let moraPago = 0;
  let contador = this.adeudoTotal;
  this.totalRestante = this.prestamoEspecifico.totalRestante;

  if(this.totalRestante<abonoEsperado && this.adeudoTotal>0){
  //  console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++Tacos');
    if(abonoActual>=this.totalRestante){
      
      this.totalRestante = this.totalRestante >= 0 ? this.totalRestante : 0;
      this.extraPago = abonoActual - this.totalRestante;
      this.saldoExtra = this.saldoExtra+this.extraPago;

      if(this.saldoExtra>=this.adeudoTotal){
        this.saldoExtra = this.saldoExtra-this.adeudoTotal;
        this.adeudoTotal=0;
        estadoPago="Extra";

      }
      else{
        this.adeudoTotal = this.adeudoTotal-this.saldoExtra;
        this.saldoExtra = 0;

        this.adeudoCliente = this.adeudoCliente - this.extraPago;

      }
      this.totalRestante = 0;

    }
    else{
      this.openDialog("El abono minimo debe de ser de $"+this.totalRestante, "assets/img/info.png");
      this.isLoading = false;  
      return;
    }
    
  }

  //Es igual
  if(abonoActual==abonoEsperado && this.totalRestante>=abonoEsperado){
    this.totalRestante = this.prestamoEspecifico.totalRestante - abonoActual;
  }

  //Aqui inicia el bloque de si la cantidad es mayor al pago diario

  if(abonoActual>abonoEsperado && this.totalRestante>=abonoEsperado){
 //   console.log('--------------------------------------------------------------Tacos');

    this.extraPago = abonoActual - abonoEsperado;
    this.saldoExtra = this.saldoExtra + this.extraPago;

    if(this.saldoExtra>=this.adeudoTotal){
      this.saldoExtra = this.saldoExtra-this.adeudoTotal;
      this.adeudoTotal=0;
      estadoPago="Extra";
    }
    else{
      this.adeudoTotal = this.adeudoTotal-this.saldoExtra;
      this.saldoExtra = 0;

      this.adeudoCliente = this.adeudoCliente - this.extraPago;

    }
    abonoActual = abonoActual-this.extraPago;
    this.totalRestante = this.prestamoEspecifico.totalRestante - abonoActual;

  }

  //Aqui inicia el bloque de si la cantidad es menor al pago diario
  else if(abonoActual<abonoEsperado && this.totalRestante>=abonoEsperado){
  //  console.log('**********************************************************************Tacos');

    this.adeudoPago = abonoEsperado-abonoActual;

    if(this.saldoExtra>=this.adeudoPago){
      abonoActual=abonoActual+this.adeudoPago;
      this.saldoExtra=this.saldoExtra-this.adeudoPago;
      this.adeudoPago=0;

    }else{
      abonoActual=abonoActual+this.saldoExtra;
      this.saldoExtra = 0
      this.adeudoPago = abonoEsperado - abonoActual;
      estadoPago="Incompleto";
    }
    
    
    let mitad = Math.round(abonoEsperado/2);
    if(abonoActual<mitad && this.numeroPago<=this.prestamoEspecifico.plazoPrestamo){

      moraPago=this.prestamoEspecifico.cobranza;
      this.puntuacion = this.puntuacion +1;
      this.morasPrestamo = this.morasPrestamo +1;
    }
    this.adeudoTotal = this.adeudoTotal+ this.adeudoPago + moraPago ;
   // console.log("--------------------------------------------------------------------");
   // console.log("Cliente: "+this.adeudoCliente +" adeudoPAgo: "+ this.adeudoPago +" mora:"+ moraPago);
    this.adeudoCliente = this.adeudoCliente + this.adeudoPago + moraPago;
    this.totalRestante = this.prestamoEspecifico.totalRestante - abonoActual;
   // console.log("Cliente: "+this.adeudoCliente +" adeudoPAgo: "+ this.adeudoPago +" mora:"+ moraPago);

  }


  if(this.prestamoEspecifico.fechaPago!=this.fecha_Solicitud || this.prestamoEspecifico.tipoUltiPago=='Sin tipo'){
    this.numeroPago = this.prestamoEspecifico.numeroPago+1;
  }

  if(this.adeudoTotal==0){
    this.puntuacion=this.puntuacion-this.morasPrestamo;
    this.morasPrestamo = 0;
    this.adeudoCliente = this.adeudoCliente - contador;
  }

  const { folioPago, _horaActual } = this.generarFolioPago();


  //this.totalRestante = this.prestamoEspecifico.totalRestante - abonoActual;

  //Aqui inicia el registro del pago en la base de datos
  const pago: Pago ={
    fecha: this.fecha_Solicitud,
    folio: folioPago,
    nombreCliente: this.prestamoEspecifico.nombre,
    numCliente: this.prestamoEspecifico.numeroCliente,
    cobranza: 0,
    cantidadPrestamo: this.prestamoEspecifico.cantidadPrestamo,
    plazo: this.prestamoEspecifico.plazoPrestamo,
    totalPagar: this.prestamoEspecifico.cantidadPagar,
    totalRestante: this.totalRestante,
    pagoDiario: this.prestamoEspecifico.pagoDiario,
    folioPrestamo: this.prestamoEspecifico.folio,
    fechaPago: this.fecha_Solicitud,
    horaPago: _horaActual,
    gestor: this.form.value.gestor,
    tipo: 'Pago',
    comentario: 'Vacio',
    abono: abonoActual,
    personasCobrador: 'Oficina',
    
    estado: estadoPago,
    numeroPago:this.numeroPago,
    adeudo:this.adeudoTotal,
    pagosPendiente: this.adeudoPago,
    mora:moraPago,
    extra:this.extraPago,
    saldoExtra: this.saldoExtra,
    real: this.form.value.montoPagado,
    metodo: this.form.value.metodo,
    sucursal: this.sharedService.getFinanciera(),
  }

  //console.log(pago);

  this.pagoService.postPago(pago).subscribe(
    (response) => {
    this.actualizarPrestamo();
    this.actualizarCliente();
   // console.log('Pago registrado con éxito:');
   // console.log(response);
    this.openDialog("Pago registrado con éxito", "assets/img/exito.png");
    this.avisoSMS();

    this.form.reset();

    this.router.navigateByUrl('/dummyRoute', { skipLocationChange: true }).then(() => {
      this.router.navigate(['dashboard/prestamos']);
    });
  },
  (error) => {
    console.error('Error al registrar Pago:', error);
    alert("Hay problemas al registrar el pago");
    this.router.navigateByUrl('/dummyRoute', { skipLocationChange: true }).then(() => {
      this.router.navigate(['dashboard/prestamos']);
    });
  });
}

*/