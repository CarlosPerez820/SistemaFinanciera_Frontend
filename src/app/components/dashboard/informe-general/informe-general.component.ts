import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Dotacion } from 'src/app/interfaces/dotacion';
import { Gasto } from 'src/app/interfaces/gasto';
import { DotacionService } from 'src/app/services/dotacion.service';
import { GastosService } from 'src/app/services/gastos.service';
import { GestorServiceService } from 'src/app/services/gestor-service.service';
import { PagoServiceService } from 'src/app/services/pago-service.service';
import { PrestamoServiceService } from 'src/app/services/prestamo-service.service';
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

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { saveAs } from 'file-saver';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-informe-general',
  templateUrl: './informe-general.component.html',
  styleUrls: ['./informe-general.component.css']
})
export class InformeGeneralComponent {

  selectedOption: string = 'option1'; // Valor predeterminado seleccionado
  lista:any;
  listaGestores:any=[];
  valorDeFecha:any;
  valorDeFecha2:any;
  valorSeleccionado:any=[];

  panelOpenState = false;

  listaRenovaciones:any=[];

  lisPago : any =[];
  listaPagos: any=[];
  listaPagosEspecificos:any=[];

  lisPrestamos:any=[];
  listaPrestamos:any=[];
  
  lisSolicitudes:any=[];
  listaSolicitudes:any=[];
  renovacionesEspecificas:any=[];
  solicitudesEspecificas:any=[];
  totalSolicitudesDia:any;
  totalRenovacionesDia:any;
  numeroSolicitudes:any;
  numeroRenovaciones:any;
  
  numeroPrestamos:any;
  totalPrestamos:any;
  listaPrestamosDelDia:any=[];

  listaCuentasPagadas:any=[];
  listaCuentasFaltantes:any=[];
  cuentasxCobrar:any;
  cuentasCobradas:any;
  totalCobrarDia:any;
  contadorNumeroPrestamos:any;
  totalCartera:any;
  totalCobrado:any;
  totalFaltante:any;
  porcentaje:any;
  mostrarResultados=false;
  pagosDelDia:any;
  adeudosDelDia:any;


  //nuevas
  totalSemanal=0;
  sumaSemanal=0;
  totalTradicional=0;
  sumaTradicional=0;
  fechaGastos:any;
  _contadorEfectivo=0;
  _totalEfectivo = 0;
  _contadorTransferencia=0;
  _totalTransferencia=0;
  cobradoOficina=0;

  efectivoGeneral=0;
  transferenciaGeneral=0;
  prestamosDelDiaGeneral:any=[];
  prestamosDelDia:any=[];
  //nuevas variables
  listaPrestamosGestor: any =[];
  lista2: any =[];
  listaGastos: Gasto[] = [];
  listaGastosGeneral: Gasto[] = [];
  valorGastos: number = 0;
  totalAdeudos: number = 0;
  listaPrestamosGeneral:any=[];
  dotacionAgisnada: number=0;
  listaDotacion : Dotacion[]=[];
  listaGenericaDotacion: any=[];
  fechaFormat: any;
  listaGastosDia: Gasto[] = [];
  _listaGastosDia: Gasto[] = [];

  fechaReporte: any;

  

  constructor(private gestorService:GestorServiceService, private sharedService:SharedService, 
              private pagoService:PagoServiceService, private prestamoService: PrestamoServiceService,
              private solicitudeService: SolicitudServiceService, private gastoService: GastosService,
              private dotacionService: DotacionService
    ) {
    
  }

  ngOnInit(): void{
    this.obtenerGestores();
    this.obtenerPrestamos();
  //  this.obtenerGastos();
  }

  cambiarValores(){
    this.mostrarResultados=false;
  }


  onDateChangeGeneral(event: MatDatepickerInputEvent<Date>) {
    const datePipe = new DatePipe('en-US');
    this.valorDeFecha2 = datePipe.transform(event.value, 'd-M-yyyy');
    this.fechaReporte = this.valorDeFecha2;
    
    let fechaDotacion:any;
    fechaDotacion =  datePipe.transform(event.value, 'yyyy-MM-dd');

   // console.log(this.valorDeFecha2);
    this.mostrarResultados=true;
    
    //this.obtenerPagos(this.valorDeFecha2);
    this.seleccionarPrestamos(fechaDia);
    this.sumarPagosGeneralDia(fechaDia);
    this.sumarPagosGeneral(this.valorDeFecha2);
   // this.buscarSolicitudesGeneral(this.valorDeFecha2);
    this.obtenerGastos(fechaDotacion);
    this.obtenerDotacionesFecha(fechaDotacion, 'oficina');
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const datePipe = new DatePipe('en-US');
    this.valorDeFecha = datePipe.transform(event.value, 'd-M-yyyy');
    this.fechaFormat =  datePipe.transform(event.value, 'yyyy-MM-dd');
    this.fechaGastos = datePipe.transform(event.value, 'yyyy-MM-dd');
  }

  buscar(){
 //   console.log(this.valorDeFecha);
 //   console.log(this.valorSeleccionado);
    this.mostrarResultados=true;

    this.seleccionarPrestamosGestor(fechaDia,this.valorSeleccionado);
  //  this.buscarSolicitudesGestor(this.valorDeFecha, this.valorSeleccionado);
    this.sumarPagosGestor(this.valorDeFecha, this.valorSeleccionado);
    this.obtenerGastosGestor( this.valorSeleccionado,this.fechaFormat );
    this.obtenerDotacionesFecha(this.fechaFormat, this.valorSeleccionado);
   // this.obtenerPrestamosDia(this.valorDeFecha, this.valorSeleccionado);

   this.fechaReporte=this.valorDeFecha;
  }
  
  obtenerGestores(){
    this.gestorService.getGestorFinanciera(this.sharedService.getFinanciera())
    .subscribe( data => {
   //   console.log(data);
      this.lista = data;
      this.listaGestores = this.lista.gestores;
   //   console.log(this.listaGestores);
    })
  }

  obtenerPrestamosDia(fecha: string, gestor:string){
    alert(fecha+"  -  "+ this.sharedService.getFinanciera());
    this.prestamoService.getPrestamosDia(this.sharedService.getFinanciera() , fecha).subscribe(data => {
      this.prestamosDelDiaGeneral = data;
      this.prestamosDelDia = this.prestamosDelDiaGeneral.prestamos;

  //    console.log("Aqui esta la data--------------------");
    //  console.log(data);

      let contRenovacion = 0;
      let totalRenovacion = 0;
      let contCredito = 0;
      let totalCredito= 0;

      this.solicitudesEspecificas = [];
      this.renovacionesEspecificas = [];

      for (let index = 0; index < this.prestamosDelDia.length; index++) {    
       // console.log(this.prestamosDelDia[index].inciadoPor);

        if (this.prestamosDelDia[index].inciadoPor.toUpperCase()==gestor.toUpperCase() && this.prestamosDelDia[index].tipoSolicitud ==="Nueva") {
          console.log("+++++ Nuevas");
          totalCredito = totalCredito + this.prestamosDelDia[index].cantidadPrestamo;
          contCredito = contCredito +1;
          this.solicitudesEspecificas.push(this.prestamosDelDia[index]);


        }
        else if (this.prestamosDelDia[index].inciadoPor.toUpperCase()==gestor.toUpperCase() && this.prestamosDelDia[index].tipoSolicitud ==="Renovacion"){
          console.log("+++++ Renovaciones");
          totalRenovacion = totalRenovacion + this.prestamosDelDia[index].cantidadPrestamo;
          contRenovacion = contRenovacion + 1;
          this.renovacionesEspecificas.push(this.prestamosDelDia[index]);

        }

      }

      this.totalSolicitudesDia = totalCredito;
      this.totalRenovacionesDia = totalRenovacion;
      this.numeroSolicitudes = contCredito;
      this.numeroRenovaciones = contRenovacion;

    })
  }


  obtenerPagos(fechaPago: any){
    return new Promise<void>((resolve, reject) => {
      this.pagoService.getPagosFinancieraFecha(this.sharedService.getFinanciera(), fechaPago)
      .subscribe((data) => {
       //   console.log(data);
          this.lisPago = data;
          this.listaPagos = this.lisPago.pagos;
       //   console.log(this.listaPagos);
       this.listaPagos = this.listaPagos.filter((pago: any) => pago.tipo === 'Pago');

          resolve(); 
        }, (error) => {
          reject(error); 
        });
    });
  }
  
  
  obtenerPrestamos(){
    this.prestamoService.getPrestamosValidosFinanciera(this.sharedService.getFinanciera())
    .subscribe( data => {
    //  console.log(data);
      this.lisPrestamos = data;
      this.listaPrestamos = this.lisPrestamos.prestamos;
      this.listaPrestamosGeneral = this.listaPrestamos;
      this.listaPrestamosGeneral = this.listaPrestamosGeneral.filter((prestamo: any) => prestamo.estatus === 'Activo');

    //  console.log(this.listaPrestamos);
    })
  }

  obtenerSolicitudes(fecha:any){
    return new Promise<void>((resolve, reject) => {
    this.solicitudeService.getSolicitudesFinancieraDia(this.sharedService.getFinanciera(), fecha)
    .subscribe((data) => {
    //  console.log(data);
      this.lisSolicitudes = data;
      this.listaSolicitudes = this.lisSolicitudes.solicitudes;
    //  console.log(this.listaSolicitudes);
      resolve(); 
    }, (error) => {
      reject(error); 
    });
  });
}


  seleccionarPrestamos(fechaDelDia: any){
    this.listaCuentasPagadas=[];
    this.listaCuentasFaltantes=[];
    this.listaPrestamosDelDia=[];

    let contador=0;
    let contador1=0;    
    let contador2=0;
    let contador3=0;
    let contador4=0;
    let contador5=0;
    let contadorAdeudo=0;

    let contadorSemanal=0;
    let contadorTradicional=0;
    let cantidadSemanal=0;
    let cantidadTradicional=0;

    for (let index = 0; index < this.listaPrestamos.length; index++) { 

      if(this.listaPrestamos[index].estatus=='Activo'){

          if(this.listaPrestamos[index].tipoPrestamo=='semanal'){
            contadorSemanal=contadorSemanal+1;
            cantidadSemanal = cantidadSemanal + this.listaPrestamos[index].totalRestante;
          }
          else if(this.listaPrestamos[index].tipoPrestamo=='tradicional'){
            contadorTradicional=contadorTradicional+1;
            cantidadTradicional = cantidadTradicional + this.listaPrestamos[index].totalRestante;
          }

          contador=contador+1;
          contador1 = contador1+this.listaPrestamos[index].pagoDiario;

                    console.log(this.listaPrestamos[index].fechaPago);
                    console.log(fechaDelDia);


          if (this.listaPrestamos[index].fechaPago!=fechaDelDia) {
          this.listaCuentasFaltantes.push(this.listaPrestamos[index]);
          contador3=contador3+this.listaPrestamos[index].pagoDiario;
          } 
          if (this.listaPrestamos[index].fechaPago==fechaDelDia) {
          this.listaCuentasPagadas.push(this.listaPrestamos[index]);
          contador4=contador4+this.listaPrestamos[index].pagoDiario;
        //  console.log("Contador 4");
        //  console.log(this.listaPrestamos[index]);
          }
          if (this.listaPrestamos[index].fecha==fechaDelDia) {
            this.listaPrestamosDelDia.push(this.listaPrestamos[index]);
            contador5=contador5+this.listaPrestamos[index].cantidadPrestamo;
          }

          contador2 = contador2 + this.listaPrestamos[index].totalRestante;
       //   console.log(index+" - "+this.listaPrestamos[index].totalRestante+" - suma: "+contador2);

          contadorAdeudo = contadorAdeudo + this.listaPrestamos[index].adeudo;

      }      
    }

    this.totalSemanal = contadorSemanal;
    this.sumaSemanal = cantidadSemanal;
    this.totalTradicional = contadorTradicional;
    this.sumaTradicional = cantidadTradicional;


    this.totalCobrarDia = contador1;
    this.contadorNumeroPrestamos = contador;
    this.totalCartera = contador2;
    this.totalAdeudos = contadorAdeudo;

  //  console.log(this.listaPrestamos.length);


    this.cuentasxCobrar=this.listaCuentasFaltantes.length;
    this.totalFaltante = contador3;
    this.cuentasCobradas=this.listaCuentasPagadas.length;
        console.log("****************************************************************");

    console.log(this.listaCuentasPagadas);
    this.totalCobrado =  contador4;
   // this.calcularPorcentaje(this.cuentasCobradas,this.contadorNumeroPrestamos);

   this.totalPrestamos = contador5;
   this.numeroPrestamos = this.listaPrestamosDelDia.length;
}

seleccionarPrestamosGestor(fechaDelDia: any, gestor:any){
  this.listaCuentasPagadas=[];
  this.listaCuentasFaltantes=[];
  this.listaPrestamosDelDia=[];

  this.listaPrestamosGeneral = [];
  let contador=0;
  let contador1=0;    
  let contador2=0;
  let contador3=0;
  let contador4=0;
  let contador5=0;
  let contadorAdeudo=0;

  let contadorSemanal=0;
  let contadorTradicional=0;
  let cantidadSemanal=0;
  let cantidadTradicional=0;


  for (let index = 0; index < this.listaPrestamos.length; index++) {   
    if(this.listaPrestamos[index].estatus=='Activo'){

      if(this.listaPrestamos[index].gestor==gestor)
      {

        if(this.listaPrestamos[index].tipoPrestamo=='semanal'){
          contadorSemanal=contadorSemanal+1;
          cantidadSemanal = cantidadSemanal + this.listaPrestamos[index].totalRestante;
        }
        else if(this.listaPrestamos[index].tipoPrestamo=='tradicional'){
          contadorTradicional=contadorTradicional+1;
          cantidadTradicional = cantidadTradicional + this.listaPrestamos[index].totalRestante;
        }


        contador1 = contador1+this.listaPrestamos[index].pagoDiario;
        contador=contador+1;
        this.listaPrestamosGeneral.push(this.listaPrestamos[index]);
        contadorAdeudo = contadorAdeudo + this.listaPrestamos[index].adeudo;

        if (this.listaPrestamos[index].fechaPago!=fechaDelDia) {
        this.listaCuentasFaltantes.push(this.listaPrestamos[index]);
        contador3=contador3+this.listaPrestamos[index].pagoDiario;
        } 
        if (this.listaPrestamos[index].fechaPago==fechaDelDia) {
        this.listaCuentasPagadas.push(this.listaPrestamos[index]);
        contador4=contador4+this.listaPrestamos[index].pagoDiario;
      //  console.log("El contador numero 4 muestra: "+contador4);
        }
        if (this.listaPrestamos[index].fecha==fechaDelDia) {
          this.listaPrestamosDelDia.push(this.listaPrestamos[index]);
          contador5=contador5+this.listaPrestamos[index].cantidadPrestamo;
        }
        contador2 = contador2 + this.listaPrestamos[index].totalRestante;
      }
    }
          
  }


  
  this.totalSemanal = contadorSemanal;
  this.sumaSemanal = cantidadSemanal;
  this.totalTradicional = contadorTradicional;
  this.sumaTradicional = cantidadTradicional;

  this.totalAdeudos = contadorAdeudo;

  this.totalCobrarDia = contador1;
  this.contadorNumeroPrestamos = contador;
  this.totalCartera = contador2;

  this.cuentasxCobrar=this.listaCuentasFaltantes.length;
  this.totalFaltante = contador3;
  this.cuentasCobradas=this.listaCuentasPagadas.length;
  this.totalCobrado =  contador4;
  
 // this.calcularPorcentaje(this.cuentasCobradas,this.contadorNumeroPrestamos);

 this.totalPrestamos = contador5;
 this.numeroPrestamos = this.listaPrestamosDelDia.length;
}

buscarSolicitudesGeneral(fecha:any){

  this.obtenerSolicitudes(fecha)
    .then(() => {
     
      this.solicitudesEspecificas=[];
      this.renovacionesEspecificas=[];
      let sumaSolicitud=0;
      let sumaRenovacion=0;
      
      for (let index = 0; index < this.listaSolicitudes.length; index++) {
          if(this.listaSolicitudes[index].tipo=="Renovacion"){
            this.renovacionesEspecificas.push(this.listaSolicitudes[index]);
            sumaRenovacion=sumaRenovacion+this.listaSolicitudes[index].montoSolicitado;  
          }
          else{
            this.solicitudesEspecificas.push(this.listaSolicitudes[index]);
            sumaSolicitud=sumaSolicitud+this.listaSolicitudes[index].montoSolicitado;
          }
      }
      this.totalSolicitudesDia=sumaSolicitud;
      this.totalRenovacionesDia=sumaRenovacion;
      this.numeroRenovaciones=this.renovacionesEspecificas.length;
      this.numeroSolicitudes=this.solicitudesEspecificas.length;
    })
    .catch(error => {
      console.error('Error al obtener Pagos:', error);
    });
}

buscarSolicitudesGestor(fecha:any, gestor:any){

  this.obtenerSolicitudes(fecha)
    .then(() => {
     
      this.solicitudesEspecificas=[];
      this.renovacionesEspecificas=[];
      let sumaSolicitud=0;
      let sumaRenovacion=0;

      for (let index = 0; index < this.listaSolicitudes.length; index++) {
        if (this.listaSolicitudes[index].gestorAsignado==gestor)
        {
          if(this.listaSolicitudes[index].tipo=="Renovacion"){
            this.renovacionesEspecificas.push(this.listaSolicitudes[index]);
            sumaSolicitud=sumaSolicitud+this.listaSolicitudes[index].montoSolicitado;  
          }
          else{
            this.solicitudesEspecificas.push(this.listaSolicitudes[index]);
            sumaRenovacion=sumaRenovacion+this.listaSolicitudes[index].montoSolicitado;
          }
        }   
      }
      this.totalSolicitudesDia=sumaSolicitud;
      this.totalRenovacionesDia=sumaRenovacion;
      this.numeroRenovaciones=this.renovacionesEspecificas.length;
      this.numeroSolicitudes=this.solicitudesEspecificas.length;
    })
    .catch(error => {
      console.error('Error al obtener Pagos:', error);
    });
}


sumarPagosGeneral(fecha:any){

  this.obtenerPagos(fecha)
    .then(() => {

      let contador=0;
      let contador2=0;
      let contadorEfectivo=0;
      let totalEfectivo = 0;
      let contadorTransferencia=0;
      let totalTransferencia=0;
      let totalOficina = 0;
      let totalOficinaEfectivo=0;
      let totalOficinaTransferencia=0;

      this.listaPagosEspecificos=[];
      for (let index = 0; index < this.listaPagos.length; index++) { 
        if(this.listaPagos[index].tipo=="Pago"){
          contador=contador+this.listaPagos[index].abono;
     //     console.log(this.listaPagos[index].tipo);

          if(this.listaPagos[index].metodo==="Efectivo"){

            contadorEfectivo = contadorEfectivo+1;
            totalEfectivo = totalEfectivo + this.listaPagos[index].abono;
          }
          if(this.listaPagos[index].metodo==="Transferencia"){
            contadorTransferencia = contadorTransferencia +1;
            totalTransferencia = totalTransferencia + this.listaPagos[index].abono;
          }

          if(this.listaPagos[index].personasCobrador=="Oficina")
            {
              totalOficina = totalOficina + this.listaPagos[index].abono;

              if(this.listaPagos[index].metodo==="Efectivo"){
                totalOficinaEfectivo = totalOficinaEfectivo + this.listaPagos[index].abono;
              }
              if(this.listaPagos[index].metodo==="Transferencia"){
                totalOficinaTransferencia = totalOficinaTransferencia + this.listaPagos[index].abono;
              }

            }
          


        }
      }

      this.efectivoGeneral=totalOficinaEfectivo;
      this.transferenciaGeneral = totalOficinaTransferencia;
      this.pagosDelDia=contador;
      this.listaPagosEspecificos=this.listaPagos;

      this._contadorEfectivo = contadorEfectivo;
      this._totalEfectivo = totalEfectivo;
      this._contadorTransferencia = contadorTransferencia;
      this._totalTransferencia = totalTransferencia;
      this.cobradoOficina = totalOficina;
    })
    .catch(error => {
      console.error('Error al obtener Pagos:', error);
    });
}

sumarPagosGeneralDia(fecha:any){

  this.obtenerPagos(fecha)
    .then(() => {
      let contador=0;
      this.listaPagosEspecificos=[];
      for (let index = 0; index < this.listaPagos.length; index++) { 
        contador=contador+this.listaPagos[index].abono;
      }
      this.totalCobrado=contador;

      this.listaPagosEspecificos=this.listaPagos;
    })
    .catch(error => {
      console.error('Error al obtener Pagos:', error);
    });
}

sumarPagosGestor(fecha:any, gestor:any){

  this.obtenerPagos(fecha)
    .then(() => {
      let contador=0;
      let contador2=0;
      let contadorEfectivo=0;
      let totalEfectivo = 0;
      let contadorTransferencia=0;
      let totalTransferencia=0;
      let totalOficina=0;
      let totalOficinaEfectivo=0;
      let totalOficinaTransferencia=0;

      this.listaPagosEspecificos=[];
      for (let index = 0; index < this.listaPagos.length; index++) { 

        if(this.listaPagos[index].personasCobrador==gestor)
        {
          if(this.listaPagos[index].metodo==="Efectivo"){

            contadorEfectivo = contadorEfectivo+1;
            totalEfectivo = totalEfectivo + this.listaPagos[index].abono;
          }
          if(this.listaPagos[index].metodo==="Transferencia"){
            contadorTransferencia = contadorTransferencia +1;
            totalTransferencia = totalTransferencia + this.listaPagos[index].abono;
          }
          contador=contador+this.listaPagos[index].abono;

          this.listaPagosEspecificos.push(this.listaPagos[index]);
        }
        if(this.listaPagos[index].personasCobrador=="Oficina")
          {
            totalOficina = totalOficina + this.listaPagos[index].abono;

            if(this.listaPagos[index].metodo==="Efectivo"){
              totalOficinaEfectivo = totalOficinaEfectivo + this.listaPagos[index].abono;
            }
            if(this.listaPagos[index].metodo==="Transferencia"){
              totalOficinaTransferencia = totalOficinaTransferencia + this.listaPagos[index].abono;
            }
          }
      }

      this.efectivoGeneral = totalOficinaEfectivo;
      this.transferenciaGeneral = totalOficinaTransferencia;
      this.pagosDelDia=contador;
      this._contadorEfectivo = contadorEfectivo;
      this._totalEfectivo = totalEfectivo;
      this._contadorTransferencia = contadorTransferencia;
      this._totalTransferencia = totalTransferencia;
      this.cobradoOficina = totalOficina;
    })
    .catch(error => {
      console.error('Error al obtener Pagos:', error);
    });
}

sumarPagosGestorDia(fecha:any, gestor:any){

  this.obtenerPagos(fecha)
    .then(() => {
      let contador=0;
      let contador2=0;

      this.listaPagosEspecificos=[];
      for (let index = 0; index < this.listaPagos.length; index++) { 

        if(this.listaPagos[index].gestor==gestor)
        {
          contador=contador+this.listaPagos[index].abono;
          contador2=contador2+this.listaPagos[index].pagosPendiente;

          this.listaPagosEspecificos.push(this.listaPagos[index]);
        }
      }
      this.pagosDelDia=contador;
      this.adeudosDelDia = contador2;
    })
    .catch(error => {
      console.error('Error al obtener Pagos:', error);
    });
}

calcularPorcentaje(cantidad:any, total:any){
  this.porcentaje= String(Math.round((cantidad*100)/total));
//  console.log("El porcentaje es: "+this.porcentaje);
}

obtenerGastos(fecha: string){
  const fechaInicioMes = new Date();
  fechaInicioMes.setDate(1); // Establece el día 1 del mes actual
  fechaInicioMes.setHours(0, 0, 0, 0); // Establece la hora a 00:00:00:000
  
  // Obtener la fecha de fin del mes actual
  const fechaFinMes = new Date(fechaInicioMes);
  fechaFinMes.setMonth(fechaFinMes.getMonth() + 1); // Mueve al siguiente mes
  fechaFinMes.setDate(0); // Establece el día 0, que equivale al último día del mes anterior
  fechaFinMes.setHours(23, 59, 59, 999); // Establece la hora a 23:59:59:999
  
  // Formatear fechas
  const fechaInicioFormateada = this.funformatDate(fechaInicioMes);
  const fechaFinFormateada = this.funformatDate(fechaFinMes);

  //console.log(fechaFinFormateada);

  this.gastoService.getGastosFinancieraFecha(this.sharedService.getFinanciera(), fecha, fecha)
  .subscribe( data => {
  //  console.log(data);
    this.lista2 = data;
    this.listaGastos = this.lista2.gastos;
    this.listaGastosGeneral = this.listaGastos;
 //   console.log(this.listaGastos);

    this.sumarGastos();
  })
}

funformatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses de 0-11
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

obtenerGastosGestor(responsableBuscado: string, fechaBuscada: string) {

 // console.log(responsableBuscado);
 // console.log(fechaBuscada);

  this.gastoService.getGastosFinancieraFecha(this.sharedService.getFinanciera(), fechaBuscada, fechaBuscada)
  .subscribe( data => {
    this.lista2 = data;
    this.listaGastos = this.lista2.gastos;
    this.listaGastosGeneral = this.listaGastos;

    this.listaGastosGeneral = this.listaGastos.filter(
      gasto => gasto.responsable === responsableBuscado && gasto.fecha === fechaBuscada
    );
  
    this.sumarGastos();

  })
}


sumarGastos(){
  const totalCantidad = this.listaGastosGeneral.reduce((acumulador, gasto) => acumulador + (gasto.monto ?? 0), 0);
  this.valorGastos=totalCantidad;
}




obtenerDotacionesFecha(fecha: string, gestor: string) {
 // console.log(fecha);

  this.listaDotacion = [];
  this.dotacionService.getDotacionFecha(this.sharedService.getFinanciera(), fecha)
    .subscribe(data => {
      // Asignar la lista de dotaciones obtenida del servicio
      this.listaGenericaDotacion = data;
      this.listaDotacion = this.listaGenericaDotacion.dotaciones;

      // Calcular el total de dotaciones basado en el gestor
      const totalCantidad = this.listaDotacion
        .filter(dotacion => gestor === 'oficina' || dotacion.gestor === gestor) // Filtrar solo si no es 'oficina'
        .reduce((acumulador, dotacion) => acumulador + (dotacion.monto ?? 0), 0); // Sumar los montos

      // Asignar el total calculado
      this.dotacionAgisnada = totalCantidad;
    });
}

generarPDFCorteDeCaja() {
  // Validar que haya fecha seleccionada
  if (!this.fechaReporte) {
    alert('Por favor selecciona una fecha antes de generar el PDF.');
    return; // salir si no hay fecha
  }

  const fecha = this.fechaReporte; // fecha seleccionada en formato d-M-yyyy
  const tipoConsulta = this.selectedOption === 'option1' ? 'General' : 'Ruta';
  const gestor = this.valorSeleccionado || 'No definido';

  const docDefinition = {
    content: [
      {
        text: `Corte de Financiera\nFecha: ${fecha}\nTipo de consulta: ${tipoConsulta}`,
        style: 'header'
      },
      tipoConsulta === 'Ruta' ? {
        text: `Gestor seleccionado: ${gestor}`,
        margin: [0, 0, 0, 10] as [number, number, number, number]
      } : '',

      { text: 'Resumen financiero del día', style: 'subheader' },
      {
        ul: [
          `Gastos del día: $${this.valorGastos}`,
          `Préstamos activos: ${this.contadorNumeroPrestamos}`,
          `Semanales: ${this.totalSemanal}, $${this.sumaSemanal}`,
          `Tradicionales: ${this.totalTradicional}, $${this.sumaTradicional}`,
          `Valor cartera: $${this.totalCartera}`,
          `Total a cobrar en el día: $${this.totalCobrarDia}`,
          `Cobrado por oficina: $${this.cobradoOficina}`,
          `Transferencias: $${this.transferenciaGeneral} y en efectivo: $${this.efectivoGeneral}`
        ]
      },

      { text: '\nResumen de cuentas', style: 'subheader' },
      {
        ul: [
          `Cuentas por cobrar: ${this.cuentasxCobrar} cuentas = $${this.totalFaltante}`,
          `Cuentas cobradas: ${this.cuentasCobradas} cuentas = $${this.pagosDelDia}`,
          `Transferencias: ${this._contadorTransferencia} = $${this._totalTransferencia}`,
          `Efectivo: ${this._contadorEfectivo} = $${this._totalEfectivo}`
        ]
      },

      { text: '\nDotación y entrega', style: 'subheader' },
      {
        ul: [
          `Dotación asignada: $${this.dotacionAgisnada}`,
          `Total a entregar: $${this.pagosDelDia + this.dotacionAgisnada - this.valorGastos - this._totalTransferencia}`
        ]
      },

      // Pagos Recolectados (detalle tabla)
      { text: '\nPagos Recolectados (Detalle)', style: 'subheader' },
      {
        table: {
          widths: ['auto', '*', 'auto', 'auto', '*'],
          body: [
            ['Fecha', 'Cliente', 'Abono', 'Hora de registro', 'Cobrado por'],
            ...this.listaPagosEspecificos.map((p: any) => [
              p.fecha,
              p.nombreCliente,
              `$${p.abono}`,
              p.horaPago,
              p.personasCobrador
            ])
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 10] as [number, number, number, number]
      },

      // Cuentas Faltantes (tabla)
      { text: '\nCuentas Faltantes', style: 'subheader' },
      {
        table: {
          widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: [
            ['Plazo', 'Cliente', 'Pago', 'Cantidad Prestada', 'Pado Diario', 'Restante'],
            ...this.listaCuentasFaltantes.map((p: any) => [
              p.plazoPrestamo,
              p.nombre,
              p.numeroPago,
              `$${p.cantidadPrestamo}`,
              `$${p.pagoDiario}`,
              `$${p.totalRestante}`
            ])
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 10] as [number, number, number, number]
      },

      // Solicitudes Generadas (tabla)
      { text: '\nSolicitudes Generadas', style: 'subheader' },
      {
        table: {
          widths: ['auto', 'auto', 'auto', '*'],
          body: [
            ['Fecha Solicitud', 'Monto Solicitado', 'Total a Pagar', 'Solicitante'],
            ...this.solicitudesEspecificas.map((s: any) => [
              s.fechaSolicitud,
              `$${s.montoSolicitado}`,
              `$${s.totalPagar}`,
              s.nombre
            ])
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 10] as [number, number, number, number]
      },

      // Renovaciones Generadas (tabla)
      { text: '\nRenovaciones Generadas', style: 'subheader' },
      {
        table: {
          widths: ['auto', 'auto', 'auto', '*'],
          body: [
            ['Fecha Solicitud', 'Monto Solicitado', 'Total a Pagar', 'Solicitante'],
            ...this.renovacionesEspecificas.map((r: any) => [
              r.fechaSolicitud,
              `$${r.montoSolicitado}`,
              `$${r.totalPagar}`,
              r.nombre
            ])
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 10] as [number, number, number, number]
      }
    ],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 10] as [number, number, number, number]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5] as [number, number, number, number]
      }
    }
  };

  const pdf = pdfMake.createPdf(docDefinition);
  const nombreArchivo = tipoConsulta === 'Ruta'
    ? `Corte_${gestor}_${fecha.replace(/-/g, '-')}.pdf`
    : `Corte_General_${fecha.replace(/-/g, '-')}.pdf`;

  pdf.getBlob(blob => {
    saveAs(blob, nombreArchivo);
  });
}



}