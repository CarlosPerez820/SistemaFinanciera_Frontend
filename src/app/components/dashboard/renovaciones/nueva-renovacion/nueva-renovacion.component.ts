import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Gestor } from 'src/app/interfaces/gestor';
import { Solicitudes } from 'src/app/interfaces/solicitud';
import { ClienteServiceService } from 'src/app/services/cliente-service.service';
import { GestorServiceService } from 'src/app/services/gestor-service.service';
import { InteresServiceService } from 'src/app/services/interes-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { SolicitudServiceService } from 'src/app/services/solicitud-service.service';

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
  
  prestamos: any[] = [
    {value: 'Diario', viewValue: 'Por dia'},
    {value: 'Semanal', viewValue: 'Por semana'},
  ];

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

 constructor(private fb: FormBuilder, private gestorService: GestorServiceService, private sharedService: SharedService,
              private route: ActivatedRoute, private clienteService: ClienteServiceService, private interesService: InteresServiceService,
              private solicitudService: SolicitudServiceService, private router: Router
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
      edad: ['',Validators.required],
      direccion: ['',Validators.required],
      colonia: ['',Validators.required],
      senasDomicilio: ['',Validators.required],
      ciudad: ['',Validators.required],
      celular: ['',Validators.required],
      telefonoFijo: ['',Validators.required],
      telefonoAdicional: ['',Validators.required],
      estadoCivil: ['',Validators.required],
      tiempoCasados: ['',Validators.required],
      dependientes: ['',Validators.required],
      tipoVivienda: ['',Validators.required],
      tiempoVivienda: ['',Validators.required],
      pagoRenta: ['',Validators.required],
      tipoNegocio: ['',Validators.required],
      tiempoNegocio: ['',Validators.required],
      numeroINE: ['',Validators.required],
      RFC: ['',Validators.required],
      conyugue: ['',Validators.required],
      trabajoConyugue: ['',Validators.required],
      domicilioConyugue: ['',Validators.required],
      antiguedadConyugue: ['',Validators.required],
      ingresoSolicitante: ['',Validators.required],
      ingresosConyugue: ['',Validators.required],
      gastos: ['',Validators.required],
      creditosActuales: ['',Validators.required],
      motivos: ['',Validators.required],
      gestor: ['',Validators.required],
      tipoPrestamo: ['', Validators.required],
    })
  }


  ngOnInit(): void{
    this.obtenerGestores();
    this.mongoIdCliente = this.route.snapshot.paramMap.get("id");
    console.log(this.mongoIdCliente);
    this.obtenerCliente();
    this.obtenerListaDeInteres();
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
    const solicitud: Solicitudes = {
        fechaSolicitud: this.form.value.fecha,
        montoSolicitado: this.form.value.montoSolicitado,
        montoAutorizado: 0,
        totalPagar: this.form.value.totalPagar,
        pagoDiario: this.form.value.pagoDiario,
        plazo: this.form.value.plazo,
        numeroCliente: this.form.value.numeroCliente,
        nombre: this.eliminarAcentos2(this.form.value.nombreSolicitante),
        edad: this.form.value.edad,
        direccion: this.form.value.direccion,
        colonia: this.form.value.colonia,
        senasDomicilio: this.form.value.senasDomicilio,
        entrecalles: 'Generico',
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
        alert("Registro exitoso");
        this.router.navigate(['dashboard/clientes']);
      }
    }, error => {
      console.log(error); 
    });
  }

  eliminarAcentos2(n: any){
    return n.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
  }

}
