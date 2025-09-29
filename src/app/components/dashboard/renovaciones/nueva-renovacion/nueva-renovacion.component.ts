import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoDialogComponent } from 'src/app/components/info-dialog/info-dialog.component';
import { Gestor } from 'src/app/interfaces/gestor';
import { Solicitudes } from 'src/app/interfaces/solicitud';
import { ClienteServiceService } from 'src/app/services/cliente-service.service';
import { GestorServiceService } from 'src/app/services/gestor-service.service';
import { InteresServiceService } from 'src/app/services/interes-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { SolicitudServiceService } from 'src/app/services/solicitud-service.service';
import { TasasService } from 'src/app/services/tasas.service';
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

@Component({
  selector: 'app-nueva-renovacion',
  templateUrl: './nueva-renovacion.component.html',
  styleUrls: ['./nueva-renovacion.component.css']
})
export class NuevaRenovacionComponent {

  viviendas: any[] = [
    {value: 'Propia', viewValue: 'Propia'},
    {value: 'Rentada', viewValue: 'Rentada'},
    {value: 'Familiar', viewValue: 'Familiar'},
  ];
  
  prestamos: any[] = [];

   //Vaiables Globales
   fecha_Solicitud: string =fechaDia;
   lista: any =[];
   listaGestores: Gestor[] = [];
   form: FormGroup;
   numeroDeClienteID: any;
   mongoIdCliente: any;
   lista2:any = [];
   clienteEspecifico: any = [];
   lista3:any=[];
   listaDeInteres:any =[];
   listaTasaDiaria: any =[];
   listaTasaSemanal: any =[];
   isLoading = false;
   variableURL = url_server;

   onSemanal = false;
   listaInteres: any;
   tasaSemanal: any[] = [];
   plazoSemanal: any[] = [];
 

   //------------------------Nuevo calculo de montos y tasas
   tasasTradicional: any[] = [];
   tasasBlindage: any[] = [];
   tasaSeleccionada: any = [];
  interes: any;
   tipoPrestamo: any;
 
   listaPlazo: any;

   sucursalCliente=false;


 constructor(private fb: FormBuilder, private gestorService: GestorServiceService, private sharedService: SharedService,
              private route: ActivatedRoute, private clienteService: ClienteServiceService, private interesService: InteresServiceService,
              private solicitudService: SolicitudServiceService, private router: Router, private dialog: MatDialog,
              private tasasService: TasasService
            )
              {
    this.form = this.fb.group({
      numeroCliente: ['',Validators.required],
      fecha: [this.fecha_Solicitud,Validators.required],
      montoSolicitado: ['',Validators.required],
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
      tipoNegocio:[''],
      telefono:[''],
      direccionNegocio:[''],
      creditosGenerales:[''],
      gestor: ['',Validators.required],
      tipoPrestamo: ['tradicional', Validators.required],
      interesSemanal:['']

    })
  }


  ngOnInit(): void{
    if(this.sharedService.getFinanciera()==this.sharedService.getSucursalCliente()){
      this.sucursalCliente = true;
    }
    this.obtenerGestores();
    this.mongoIdCliente = this.route.snapshot.paramMap.get("id");
    console.log(this.mongoIdCliente);
    this.obtenerCliente();
    this.obtenerListaDeInteres();

    this.tasasTradicional = this.tasasService.getTasasTradicional();
    this.tasaSemanal = this.tasasService.getTasasSemanal();   
    this.plazoSemanal = this.tasasService.getPlazoSemanal();     
    this.prestamos = this.tasasService.getTipoPrestamos();
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
      conyugue:  this.clienteEspecifico.nombreConyugue,
      trabajoConyugue:  this.clienteEspecifico.trabajoConyugue,
      domicilioConyugue:  this.clienteEspecifico.domicilioConyugue,
      antiguedadConyugue:  this.clienteEspecifico.antiguedadConyugue,
      ingresoSolicitante:  this.clienteEspecifico.ingresoSolicitante,
      ingresosConyugue:  this.clienteEspecifico.ingresoConyugue,
      gastos:  this.clienteEspecifico.gastosTotales,
      telefono:this.clienteEspecifico.telefonoFijo,
      direccionNegocio:this.clienteEspecifico.direccionNegocio,
      creditosGenerales:this.clienteEspecifico.creditosGenerales,
      creditosActuales:  this.clienteEspecifico.numeroPrestamos,
      gestor:  this.clienteEspecifico.gestorAsignado
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
    let plazoNumber = this.form.value.plazo;
    let montoNumber =this.form.value.montoSolicitado;

    if(this.tipoPrestamo=='semanal'){
          let meses=0; //almacena el equivalente a meses de las semanas
          let pagoMes=0; //el pago por mes

          meses = plazoNumber.dia/4;
          
          pagoMes = Math.round((montoNumber * this.interes)/100);
          total = montoNumber+(pagoMes * meses);
          pagoDia = Math.round(total/plazoNumber.dia);
    }

    if(this.tipoPrestamo=='tradicional'){
            total = Math.round((montoNumber * this.interes)/100)+montoNumber;
            pagoDia = Math.round(total/plazoNumber.dia);
    }


    /*
      total = Math.round((montoNumber * this.interes)/100)+montoNumber;
      pagoDia = Math.round(total/plazoNumber.dia);
    */

    

    this.form.get('totalPagar')?.setValue(total);
    this.form.get('pagoDiario')?.setValue(pagoDia);
  }

  calcularNuevosMontos2(){
    let total=0;
    let pagoDia = 0;
    let plazoNumber = this.form.value.plazo;
    let montoNumber =this.form.value.montoSolicitado;
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


  generarSolicitud(){
    if (this.isLoading) {
      return;  
    }
    this.isLoading = true;  


    let plazoPrestamo =  this.form.value.plazo.dia;
    
    if(this.sharedService.getFinanciera()==this.sharedService.getSucursalCliente()){
      plazoPrestamo = this.form.value.plazo;
    }


    const solicitud: Solicitudes = {
      fechaSolicitud: this.form.value.fecha,
      montoSolicitado: this.form.value.montoSolicitado,
      montoAutorizado: 0,
      totalPagar: this.form.value.totalPagar,
      pagoDiario: this.form.value.pagoDiario,
      plazo: plazoPrestamo,

      numeroCliente: this.form.value.numeroCliente,
      nombre: this.eliminarAcentos2(this.form.value.nombreSolicitante),
      edad: "desabilitado",
      direccion: this.form.value.direccion,
      colonia: this.form.value.colonia,
      senasDomicilio:"desabilitado",
      entrecalles: "desabilitado",
      ciudad: this.form.value.ciudad,
      celular: this.form.value.celular,
      telefonoFijo: this.form.value.telefono,
      telefonoAdicional:"desabilitado",
      estadoCivil: this.form.value.estadoCivil,
      tiempoCasados: "desabilitado",
      dependientes: "desabilitado",
      tipoVivienda: this.form.value.tipoVivienda,
      tiempoViviendo: this.form.value.tiempoVivienda,
      pagoRenta: this.form.value.pagoRenta,
      tipoNegocio: this.form.value.tipoNegocio,
      direccionNegocio: this.form.value.direccionNegocio,
      tiempoNegocio: this.form.value.tiempoNegocio,
      numeroIdentificacion: this.form.value.numeroINE,
      RFC: 'desabilitado',
      nombreConyugue: this.form.value.conyugue,
      trabajoConyugue: "desabilitado",
      domicilioConyugue: "desabilitado",
      antiguedadConyugue: "desabilitado",
      ingresoSolicitante: this.form.value.ingresoSolicitante,
      ingresoConyugue: 0,
      gastosTotales: 0,
      gestorAsignado: this.form.value.gestor,
      infoCredito: this.form.value.motivos,
      estatus: "Pendiente",
      tipo: "Renovacion",
      tipoPrestamo: this.form.value.tipoPrestamo,
      sucursal: this.sharedService.getFinanciera()
    }

    console.log(solicitud);
    
    this.solicitudService.guardarSolicitud(solicitud).subscribe(response => {

      if(response){
        console.log("Registro de solicitud exitoso");
        console.log(response);
        this.isLoading = false;  
        this.openDialog("La renovación se genero exitosamente", "assets/img/exito.png");
        if(this.sharedService.getFinanciera()!==this.sharedService.getSucursalCliente()){
          this.avisoSMS();
        }
        this.router.navigate(['dashboard/clientes']);
      }
    }, error => {
      console.log(error); 
      this.isLoading = false;  
      this.openDialog("Lo sentimos, hubo un error y no se pudo registrar", "assets/img/error.png");
    });
  }

  eliminarAcentos2(n: any){
    return n.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
  }

  avisoSMS(){
    let texto="Hola "+ this.clienteEspecifico.nombre + ", nos comunicamos de "+ this.clienteEspecifico.sucursal + " para informarte "+
    "que su solicitud de una renovacion por el monto de :$"+this.form.value.montoSolicitado+" a un plazo de "+ this.form.value.plazo.dia+" dias, fue "+
    "generada exitosamente y esta en espera de revisión";

    let WhatsappNumero=this.form.value.celular;
    let codigoPais: string ="52";
    let urlWhats= "https://wa.me/"+ codigoPais+WhatsappNumero+"?text="+texto;
  
    
    console.log("SMS....................." + urlWhats);
    window.open(urlWhats, "_blank"); // Abre en una nueva pestaña o ventana
  }


}
