import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteServiceService } from 'src/app/services/cliente-service.service';
import { GestorServiceService } from 'src/app/services/gestor-service.service';
import { SolicitudServiceService } from 'src/app/services/solicitud-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { Gestor } from 'src/app/interfaces/gestor';
import { InteresServiceService } from 'src/app/services/interes-service.service';
import { Solicitudes } from 'src/app/interfaces/solicitud';
import { Prestamo } from 'src/app/interfaces/prestamo';
import { PrestamoServiceService } from 'src/app/services/prestamo-service.service';
import { Clientes } from 'src/app/interfaces/clientes';
import { ParametroServiceService } from 'src/app/services/parametro-service.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

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

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { InfoDialogComponent } from 'src/app/components/info-dialog/info-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TasasService } from 'src/app/services/tasas.service';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-revisa-renovacion',
  templateUrl: './revisa-renovacion.component.html',
  styleUrls: ['./revisa-renovacion.component.css']
})
export class RevisaRenovacionComponent {
   //Vaiables Globales
   fecha_Solicitud: string =fechaDia;
   lista: any =[];
   listaGestores: Gestor[] = [];
   activo = false;
   lista2:any = [];
   SolicitudEspecifica: any = [];
   lista3: any =[];
   listaDeInteres: any =[];
   lista4: any=[];
   listaClientes: any =[];
   lista5: any=[];
   listaParametros: any =[];
   listaTasaDiaria: any =[];
   listaTasaSemanal:any=[];
   clienteEspecifico: any = [];
   isLoading = false;

   
    onSemanal = false;
    listaInteres: any;
    tasaSemanal: any[] = [];
    plazoSemanal: any[] = [];

   imageURL: string = 'http&rs=1';
   variableURL = url_server;
   pdfFileName: string = 'mi_pdf';

  form: FormGroup;
  mongoIdSolicitud: any;

  viviendas: any[] = [
    {value: 'Propia', viewValue: 'Propia'},
    {value: 'Rentada', viewValue: 'Rentada'},
    {value: 'Familiar', viewValue: 'Familiar'},
  ];

  //------------------------Nuevo calculo de montos y tasas
  tasasTradicional: any[] = [];
  tasasBlindage: any[] = [];
  tasaSeleccionada: any = [];
  prestamos: any = [];
  interes: any;
  tipoPrestamo: any;
  listaPlazo: any;

  sucursalCliente=false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private gestorService: GestorServiceService,
              private solicitudService: SolicitudServiceService, private sharedService: SharedService,
              private interesService: InteresServiceService, private router: Router, private prestamoService: PrestamoServiceService,
              private clienteService: ClienteServiceService, private parametroService: ParametroServiceService,
              private dialog: MatDialog, private tasasService: TasasService,
              private http: HttpClient){
    this.form = this.fb.group({

      fecha: [this.fecha_Solicitud,Validators.required],
      montoSolicitado: ['',Validators.required],
      montoAutorizado: ['',Validators.required],
      totalPagar: ['',Validators.required],
      pagoDiario: ['',Validators.required],
      plazo: ['',Validators.required],

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
      conyugue: ['',Validators.required],
      ingresoSolicitante: ['',Validators.required],
      creditosActuales: [''],
      motivos: ['',Validators.required],
      gestor: ['',Validators.required],
      tipoPrestamo: ['', Validators.required],

      telefonoFijo:[''],
      tipoNegocio:[''],
      direccionNegocio:[''],
      interesSemanal:['']

    })
  }

  ngOnInit(): void{
    this.mongoIdSolicitud = this.route.snapshot.paramMap.get("id");

    if(this.sharedService.getFinanciera()==this.sharedService.getSucursalCliente()){
      this.sucursalCliente = true;
    }

    console.log(this.mongoIdSolicitud);
    this.obtenerGestores();
    this.obtenerSolicitud();
    this.obtenerListaDeInteres();
    this.obtenerParametos();
    this.tasasTradicional = this.tasasService.getTasasTradicional();
    this.tasaSemanal = this.tasasService.getTasasSemanal();   
    this.plazoSemanal = this.tasasService.getPlazoSemanal(); 
    this.prestamos = this.tasasService.getTipoPrestamos();
  }

  obtenerParametos(){
    this.parametroService.getParametrosFinanciera(this.sharedService.getFinanciera()).subscribe(
      (data) => {
        this.lista5 = data;
        this.listaParametros = this.lista5.parametros;
        console.log(this.listaParametros);
      },
      (error) => {
        console.error('Error al obtener la lista de los parametros:', error);
      });
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

  obtenerSolicitud(){
    this.solicitudService.getSolicitudEspecifico(this.mongoIdSolicitud)
    .subscribe( data => {
      console.log(data);
      this.lista2 = data;
      this.SolicitudEspecifica = this.lista2.solicitud;
      console.log(this.SolicitudEspecifica);
  //    console.log("Este es el numero de cliente "+this.SolicitudEspecifica.numeroCliente);
      this.llenarFormulario();
      this.obtenerClientes();

      this.tipoPrestamo=this.SolicitudEspecifica.tipoPrestamo;
      if(this.tipoPrestamo=="tradicional"){
        this.tasaSeleccionada = this.tasasTradicional;
        this.onSemanal = false;
  
  
      }
      else if(this.tipoPrestamo=="semanal"){
        this.tasaSeleccionada = this.plazoSemanal;
        this.onSemanal= true;
      }
    })
  }

  obtenerClientes(){
    this.clienteService.getClientesPorNumeroFinanciera(this.sharedService.getFinanciera(),this.SolicitudEspecifica.numeroCliente)
    .subscribe( data => {
      console.log(data);
      this.lista4 = data;
      this.listaClientes = this.lista4.clientes;
      console.log(this.listaClientes[0]);
      this.clienteEspecifico = this.listaClientes[0];
    })
  }

  llenarFormulario(){
    console.log(this.SolicitudEspecifica.plazo);

    if(this.SolicitudEspecifica.tipoPrestamo=="tradicional"){
      this.tasaSeleccionada = this.tasasTradicional;
    }
    else if(this.SolicitudEspecifica.tipoPrestamo=="semanal"){
      this.tasaSeleccionada = this.plazoSemanal;
    }

    console.log("Tasa seleccioanda");

    console.log(this.tasaSeleccionada);

    this.form.patchValue({

      fecha : this.SolicitudEspecifica.fechaSolicitud,
      montoSolicitado: this.SolicitudEspecifica.montoSolicitado,
      totalPagar: this.SolicitudEspecifica.totalPagar,
      pagoDiario: this.SolicitudEspecifica.pagoDiario,
      nombreSolicitante: this.SolicitudEspecifica.nombre,
      edad: this.SolicitudEspecifica.edad,
      direccion:  this.SolicitudEspecifica.direccion,
      colonia:  this.SolicitudEspecifica.colonia,
      senasDomicilio:  this.SolicitudEspecifica.senasDomicilio,
      ciudad:  this.SolicitudEspecifica.ciudad,
      celular:  this.SolicitudEspecifica.celular,
      telefonoFijo:  this.SolicitudEspecifica.telefonoFijo,
      telefonoAdicional:  this.SolicitudEspecifica.telefonoAdicional,
      estadoCivil:  this.SolicitudEspecifica.estadoCivil,
      tiempoCasados:  this.SolicitudEspecifica.tiempoCasados,
      dependientes:  this.SolicitudEspecifica.dependientes,
      tipoVivienda:  this.SolicitudEspecifica.tipoVivienda,
      tiempoVivienda:  this.SolicitudEspecifica.tiempoViviendo,
      pagoRenta:  this.SolicitudEspecifica.pagoRenta,
      tipoNegocio:  this.SolicitudEspecifica.tipoNegocio,
      tiempoNegocio:  this.SolicitudEspecifica.tiempoNegocio,
      numeroINE:  this.SolicitudEspecifica.numeroIdentificacion,
      conyugue:  this.SolicitudEspecifica.nombreConyugue,
      trabajoConyugue:  this.SolicitudEspecifica.trabajoConyugue,
      domicilioConyugue:  this.SolicitudEspecifica.domicilioConyugue,
      antiguedadConyugue:  this.SolicitudEspecifica.antiguedadConyugue,
      ingresoSolicitante:  this.SolicitudEspecifica.ingresoSolicitante,
      ingresosConyugue:  this.SolicitudEspecifica.ingresoConyugue,
      gastos:  this.SolicitudEspecifica.gastosTotales,
      motivos: this.SolicitudEspecifica.infoCredito,
      creditosActuales:  this.SolicitudEspecifica.numeroPrestamos,
      gestor:  this.SolicitudEspecifica.gestorAsignado,
      tipoPrestamo: this.SolicitudEspecifica.tipoPrestamo,
      direccionNegocio:this.SolicitudEspecifica.direccionNegocio,
    });
  }

  obtenerListaDeInteres() {
    this.interesService.getinteresFinanciera(this.sharedService.getFinanciera()).subscribe(
      (data) => {
        //console.log(data);
        this.lista2 = data;
        this.listaDeInteres = this.lista2.intereces;
        console.log();
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

  
  onTipoChange(){
    console.log(this.tipoPrestamo);
    if(this.tipoPrestamo=="tradicional"){
      this.tasaSeleccionada = this.tasasTradicional;
      this.onSemanal = false;


    }
    else if(this.tipoPrestamo=="semanal"){
      this.tasaSeleccionada = this.plazoSemanal;
      this.onSemanal= true;
    }
  }

  onPlazoChange(){
console.log(this.tipoPrestamo);
    if(this.tipoPrestamo=="tradicional"){
      this.interes = this.listaPlazo.interes;
    }
    else if(this.tipoPrestamo=="semanal"){

    }
  }

  onTasaChange(){
    this.interes = this.listaInteres;
    console.log(this.interes);
  }

  calcularMontosNuevo(){


    let total=0;
    let pagoDia = 0;
    let plazoNumber = this.form.value.plazo.dia;
    let montoNumber =this.form.value.montoAutorizado;

    if(this.tipoPrestamo=='semanal'){
          let meses=0; //almacena el equivalente a meses de las semanas
          let pagoMes=0; //el pago por mes

          meses = plazoNumber/4;
          
          pagoMes = Math.round((montoNumber * this.interes)/100);
          total = montoNumber+(pagoMes * meses);
          pagoDia = Math.round(total/plazoNumber);

    }

    if(this.tipoPrestamo=='tradicional'){
            total = Math.round((montoNumber * this.interes)/100)+montoNumber;
            pagoDia = Math.round(total/plazoNumber);
    }
    /*
    total = Math.round((montoNumber * this.interes)/100)+montoNumber;
    pagoDia = Math.round(total/plazoNumber);
    */

    this.form.get('totalPagar')?.setValue(total);
    this.form.get('pagoDiario')?.setValue(pagoDia);
  }

  calcularNuevosMontos2(){
    let total=0;
    let pagoDia = 0;
    let plazoNumber = this.form.value.plazo;
    let montoNumber =this.form.value.montoAutorizado;
    let interes =this.form.value.interesSemanal;



    total = Math.round((montoNumber * interes)/100)+montoNumber;
    pagoDia = Math.round(total/plazoNumber);

    this.form.get('totalPagar')?.setValue(total);
    this.form.get('pagoDiario')?.setValue(pagoDia);


  }


  calcularMontos(){
    let plazoNumber = this.form.value.plazo;
    let montoNumber =this.form.value.montoSolicitado;
    let interesPor = 0;
    let interesCantidad =0;
    let total=0;
    let pagoDiario = 0;
    let plazoEnMes=0;

    if(this.form.value.tipoPrestamo){

      if(this.form.value.tipoPrestamo=='Diario'){
        this.listaTasaDiaria.forEach((interes: any) => {
          if(montoNumber>interes.limiteInferior && montoNumber<=interes.limiteSuperior){
            interesPor=interes.porcentaje;
            interesCantidad = Math.round((montoNumber*interesPor)/100);
    
            total=(montoNumber+interesCantidad);
            this.form.get('totalPagar')?.setValue(total);
    
            pagoDiario=(Math.round((montoNumber+interesCantidad)/plazoNumber));
            this.form.get('pagoDiario')?.setValue(pagoDiario);
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
            this.form.get('totalPagar')?.setValue(total);

            pagoDiario=(Math.round((total)/plazoNumber));
            this.form.get('pagoDiario')?.setValue(pagoDiario);
          }
        });
      }
    }
    else{
      alert('Por favor selecciona un tipo de prestamo');
    }
  }

  EnviarDatos(){ 
    if(this.form.invalid){
      this.openDialog("Por favor rellene todos los datos", "assets/img/info.png");
    }
    else{
      this.GenerarPrestamo();
    }
  }

  actualizarDatosCliente(){

    const cliente: Clientes={
      prestamosActivos:true,
      numeroPrestamos:this.listaClientes[0].numeroPrestamos+1,
      numeroActivos:this.listaClientes[0].numeroActivos+1
    }

    this.clienteService.PutClienteFinanciera(this.listaClientes[0]._id, cliente).subscribe(data => {
      if(data){
        console.log(data);
       // alert("Cliente Actualizado");
      }
    }, (error: any) => {
      console.log(error);
      alert("Problemas al actualizar, intente mas tarde");
    })
  }

  GenerarPrestamo() {
    if (this.isLoading) {
      return;  
    }
    this.isLoading = true;  

    today = new Date();
    day = today.getDate();
    month = today.getMonth() + 1;
    year = today.getFullYear();
    hour = today.getHours();
    minutes =  today.getMinutes();
    segundes =  today.getSeconds();
    
    try {
      let folioPrestamo = "PR" + this.eliminarAcentos2(this.form.value.nombreSolicitante).substring(0, 2) + year + month + day + hour + minutes + segundes;
      
      let valorDeMora = this.listaParametros[0].montoMora;

      if (this.form.value.tipoPrestamo == 'semanal') {
        valorDeMora = this.listaParametros[0].MoraSemanal;
      }
  
      let plazoPrestamo =  this.form.value.plazo.dia;
    
      if(this.sharedService.getFinanciera()==this.sharedService.getSucursalCliente()){
        plazoPrestamo = this.form.value.plazo;
      }

      
      const prestamo: Prestamo = {
        fecha: this.fecha_Solicitud,
        folio: folioPrestamo,
        nombre: this.eliminarAcentos2(this.form.value.nombreSolicitante),
        tipoPrestamo: this.form.value.tipoPrestamo,
        direccion: this.form.value.direccion,
        colonia: this.form.value.colonia,
        telefono: this.form.value.celular,
        cobranza: valorDeMora,
        cantidadPrestamo: this.form.value.montoAutorizado,
        cantidadPagar: this.form.value.totalPagar,
        plazoPrestamo: plazoPrestamo,
        totalRestante: this.form.value.totalPagar,
        pagoDiario: this.form.value.pagoDiario,
        fechaPago: 'xxxx',
        proximoPago: 'xx-xx-xxxx',
        gestor: this.form.value.gestor,
        tipoUltiPago: 'Sin tipo',
        estatus: 'Pendiente',
        nota: 'Sin Nota',
        numeroCliente: this.SolicitudEspecifica.numeroCliente,
        urlDinero: 'URL',
        urlPagare: 'URL',
        urlFachada: 'URL',
        numeroPago: 0,
        adeudo: 0,
        pagosPendientes:0,
        moras:0,
        saldoExtra:0,
        aCubrir:this.form.value.totalPagar,
        telefonoAdicional:this.form.value.telefonoFijo,
        direccionNegocio: this.form.value.direccionNegocio,
        tipoSolicitud:this.SolicitudEspecifica.tipo,
        inciadoPor: 'vacio',
        sucursal: this.sharedService.getFinanciera(),
      };
  
      console.log(prestamo);
  
      this.prestamoService.guardarPrestamo(prestamo).subscribe(
        (response) => {
          if (response) {
            console.log(response);

            this.EditarSolicitud();
            this.actualizarDatosCliente();

            if(this.sharedService.getFinanciera()!==this.sharedService.getSucursalCliente()){
              this.avisoSMS();
            }
    

            this.isLoading = false;  
            this.openDialog("El Prestamo se genero exitosamente", "assets/img/exito.png");
            //this.router.navigate(['dashboard/clientes']);
          }
        },
        (error) => {
          this.isLoading = false;  
          this.openDialog("El Prestamo no se pudo generar", "assets/img/error.png");
          console.log(error);
        }
      );
    } catch (error) {
      console.error("Ocurrió un error al generar el préstamo:", error);
      this.isLoading = false;  
      this.openDialog("Ocurrió un error inesperado."+error, "assets/img/error.png");
    }
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

  EditarSolicitud(){
    let plazoPrestamo =  this.form.value.plazo.dia;
    
    if(this.sharedService.getFinanciera()==this.sharedService.getSucursalCliente()){
      plazoPrestamo = this.form.value.plazo;
    }

    const solicitud: Solicitudes = {
      montoSolicitado: this.form.value.montoSolicitado,
      montoAutorizado: this.form.value.montoAutorizado,
      totalPagar: this.form.value.totalPagar,
      pagoDiario: this.form.value.pagoDiario,
      plazo: plazoPrestamo,
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
      gestorAsignado: this.form.value.gestor,
      infoCredito: this.form.value.motivos,
      estatus: "Finalizada",
      tipoPrestamo: this.form.value.tipoPrestamo,
      direccionNegocio:this.form.value.direccionNegocio,
      telefonoFijo: this.form.value.telefonoFijo,

    }

    console.log(solicitud);

    this.solicitudService.PutSolicitudFinanciera(this.mongoIdSolicitud, solicitud).subscribe(data => {
      if(data){
        console.log(data);
        //alert("Solicitud Actualizado");
        this.router.navigate(['dashboard/prestamos']);
      }
    }, (error: any) => {
      console.log(error);
      alert("Problemas al actualizar, intente mas tarde");
    })
  }

  rechazoDeSolicitud(){
    if (this.isLoading) {
      return;  
    }
    this.isLoading = true;  

    const solicitud: Solicitudes = {
      estatus: "Rechazada",
    }

    console.log(solicitud);

    this.solicitudService.PutSolicitudFinanciera(this.mongoIdSolicitud, solicitud).subscribe(data => {
      if(data){
        console.log(data);
        //alert("Solicitud Actualizado");
        this.isLoading = true;  
        this.openDialog("La Solicitud fue rechada", "assets/img/info.png");
        this.avisoSMSRechazo();
        this.router.navigate(['dashboard/clientes']);
      }
    }, (error: any) => {
      console.log(error);
    //  alert("Problemas al actualizar, intente mas tarde");
      this.isLoading = true;  

      this.openDialog("Problemas al actualizar, intente mas tarde", "assets/img/error.png");
    })
  }

  openInput(){ 
    document.getElementById("fileInput")!.click();
  }

  eliminarAcentos2(n: any){
    return n.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
  }

  //Generar EL archivo PDF
  generarPDF() {
    console.log("tacos de salsa");
    try {
      if(this.listaParametros.length==0){
        this.openDialog("Es necesario subir primero su logo para generar un PDF", "assets/img/error.png");
      }

    console.log(this.listaParametros);
    let objetoSolicitud = this.SolicitudEspecifica;
  
    this.imageURL= url_server+ this.listaParametros[0].urlLogo;

      console.log(this.imageURL);
      // Realizar la solicitud HTTP para obtener la imagen
      this.http.get(this.imageURL, { responseType: 'blob' }).subscribe(
        (imageBlob) => {
        // Convertir la imagen en base64
            const reader = new FileReader();
            reader.onloadend = () => {
              const imageBase64 = reader.result as string;
    
              // Contenido del PDF
              const documentDefinition = {
                content: [
                  {
                    text: objetoSolicitud.sucursal+'\n'+'Solicitud Para Prestamo '+objetoSolicitud.tipoPrestamo+'\n'+'\n',
                    style: 'header',
                    bold: true,
                  },
                  {
                    image: imageBase64,
                    width: 200, // Ajusta el ancho de acuerdo a tus necesidades
                    height: 140,
                    absolutePosition: { x: 350, y: 10 }, // Ajusta las coordenadas para alinear en la esquina superior derecha
                    opacity: 0.3, // Establece la opacidad (0 a 1)
                  },
                  {
                    text: '\n'+'Información del Prestamo'+'\n',
                    style: 'header',
                    bold: true,
                  },
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*', 'auto'],
                      body: [
                        ['Solicitante:'+objetoSolicitud.nombre, 'Fecha:'+objetoSolicitud.fechaSolicitud],
                        ['Monto Solicitado:$'+objetoSolicitud.montoSolicitado, 'Monto Autorizado:$'+objetoSolicitud.montoAutorizado]
                      ]
                    }
                  },
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*', '*','*'],
                      body: [
                        ['Plazo:'+objetoSolicitud.plazo+' dias', 'Total a Pagar:$'+objetoSolicitud.totalPagar, 'Pago Diario:$'+objetoSolicitud.pagoDiario]                      
                      ]
                    }
                  },
                  {
                    text: '\n'+'\n'+'Información del Cliente'+'\n',
                    style: 'header',
                    bold: true,
                  },
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*'],
                      body: [
                        ['Numero de cliente: '+objetoSolicitud.numeroCliente],
                        ['Dirección: '+objetoSolicitud.direccion],
                        ['Colonia:'+objetoSolicitud.colonia],
                        ['Ciudad:'+objetoSolicitud.ciudad],
                      ]
                    }
                  },
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*'],
                      body: [
                        ['Celular:'+objetoSolicitud.celular]   ,
                        ['Telefono secundario:'+objetoSolicitud.telefonoFijo]                      
                   
                      ]
                    }
                  },
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*'],
                      body: [
                        ['Estado Civil: '+objetoSolicitud.estadoCivil],
                        ['Tipo de vivienda:'+objetoSolicitud.tipoVivienda],
                        ['Tiempo viviendo en su domicilio: '+objetoSolicitud.tiempoViviendo], 
                        ['Pago de renta:'+objetoSolicitud.pagoRenta],
                        ['Tiempo del negocio: '+objetoSolicitud.tiempoNegocio],
                        ['Tipo del negocio: '+objetoSolicitud.tipoNegocio],

                        ['Direccion del negocio: '+objetoSolicitud.direccionNegocio],

                        ['Numero de identificación: '+objetoSolicitud.numeroIdentificacion],
                        ['RFC: '+objetoSolicitud.RFC],
                        ['Nombre del conyugue: '+objetoSolicitud.nombreConyugue], 
                        ['Ingreso del Solicitante: $' + objetoSolicitud.ingresoSolicitante],
                        ['Se necesita el credito para: '+objetoSolicitud.infoCredito],

                        
                      ]
                    }
                  },
                  {
                    text:  '\n' + "Información de la Solicitud:",
                    style: 'header',
                    bold: true,
                  },
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*', 'auto'],
                      body: [
                        ['Estado: '+objetoSolicitud.estatus, 'Tipo de Solicitud: '+objetoSolicitud.tipo],
                        ['Gestor Agisnado: '+objetoSolicitud.gestorAsignado, ''],

                      ]
                    }
                  },
                  {
                    text: '\n'+'\n'+'\n'+'\n'+'\n'+'\n'+ "Este documento es una solicitud de préstamo. La aprobación del mismo está sujeta a la evaluación crediticia y políticas de ."+objetoSolicitud.sucursal + "."+
                        "El solicitante declara que toda la información proporcionada es veraz y que ha leído y comprendido los términos y condiciones del préstamo.",
                    style:'pie',
                    
                  },
                ],
                styles: {
                  header: {
                    fontSize: 18,
                    bold: true,
                  },
                  pie:{
                    fontSize: 10
                    
                  }
                }
              };
    
              // Generar el PDF
              const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    
              // Descargar el PDF con el nombre ingresado
              this.pdfFileName='Solicitud_'+objetoSolicitud.nombre+'_'+objetoSolicitud.fechaSolicitud;
              pdfDocGenerator.getBlob((blob) => {
                saveAs(blob, this.pdfFileName + '.pdf');
              });
            };
            reader.readAsDataURL(imageBlob);
          },
          (error) => {
            console.error('Error al obtener la imagen:', error);
            alert("Hace falta su logo para crear su documento");
            // Aquí puedes manejar el error, por ejemplo, mostrar un mensaje al usuario
          });
    } catch (error) {
      this.openDialog("Ocurrió un error, verifique que tenga una imagen."+error, "assets/img/error.png");
    }
  }

  avisoSMS(){
    let texto="Hola "+ this.clienteEspecifico.nombre + ", nos comunicamos de "+ this.clienteEspecifico.sucursal + " para informarte "+
    "que su solicitud por el monto de :$"+this.form.value.montoSolicitado+" a un plazo de "+ this.form.value.plazo.dia+" dias, fue "+
    "aprobada por un monto de: $" +this.form.value.montoAutorizado;

    let WhatsappNumero=this.form.value.celular;
    let codigoPais: string ="52";
    let urlWhats= "https://wa.me/"+ codigoPais+WhatsappNumero+"?text="+texto;
  
    
    console.log("SMS....................." + urlWhats);
    window.open(urlWhats, "_blank"); // Abre en una nueva pestaña o ventana
  }

  avisoSMSRechazo(){
    let texto="Hola "+ this.clienteEspecifico.nombre + ", nos comunicamos de "+ this.clienteEspecifico.sucursal + " para informarte "+
    "que su solicitud de una renovacion por el monto de :$"+this.form.value.montoSolicitado+" a un plazo de "+ this.form.value.plazo.dia+" dias, lamentablemente fue "+
    "rechazado.";

    let WhatsappNumero=this.form.value.celular;
    let codigoPais: string ="52";
    let urlWhats= "https://wa.me/"+ codigoPais+WhatsappNumero+"?text="+texto;
  
    
    console.log("SMS....................." + urlWhats);
    window.open(urlWhats, "_blank"); // Abre en una nueva pestaña o ventana
  }

  navegarExpediente(clienteId: any) {
    
      this.router.navigate(['/dashboard/expediente', clienteId]);
    
  }

}

