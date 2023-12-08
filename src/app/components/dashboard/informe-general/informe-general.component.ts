import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
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

  constructor(private gestorService:GestorServiceService, private sharedService:SharedService, 
              private pagoService:PagoServiceService, private prestamoService: PrestamoServiceService,
              private solicitudeService: SolicitudServiceService
    ) {
    
  }

  ngOnInit(): void{
    this.obtenerGestores();
    this.obtenerPrestamos();
  }

  cambiarValores(){
    this.mostrarResultados=false;
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const datePipe = new DatePipe('en-US');
    this.valorDeFecha = datePipe.transform(event.value, 'd-M-yyyy');
  }

  onDateChangeGeneral(event: MatDatepickerInputEvent<Date>) {
    const datePipe = new DatePipe('en-US');
    this.valorDeFecha2 = datePipe.transform(event.value, 'd-M-yyyy');
    console.log(this.valorDeFecha2);
    this.mostrarResultados=true;
    
    //this.obtenerPagos(this.valorDeFecha2);
    this.seleccionarPrestamos(fechaDia);
    this.sumarPagosGeneralDia(fechaDia);
    this.sumarPagosGeneral(this.valorDeFecha2);
    this.buscarSolicitudesGeneral(this.valorDeFecha2);
  }

  buscar(){
    console.log(this.valorDeFecha);
    console.log(this.valorSeleccionado);
    this.mostrarResultados=true;

    this.seleccionarPrestamosGestor(fechaDia,this.valorSeleccionado);
    this.buscarSolicitudesGestor(this.valorDeFecha, this.valorSeleccionado);
    this.sumarPagosGestor(this.valorDeFecha, this.valorSeleccionado);
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


  obtenerPagos(fechaPago: any){
    return new Promise<void>((resolve, reject) => {
      this.pagoService.getPagosFinancieraFecha(this.sharedService.getFinanciera(), fechaPago)
      .subscribe((data) => {
          console.log(data);
          this.lisPago = data;
          this.listaPagos = this.lisPago.pagos;
          console.log(this.listaPagos);
          resolve(); 
        }, (error) => {
          reject(error); 
        });
    });
  }
  
  
  obtenerPrestamos(){
    this.prestamoService.getPrestamosValidosFinanciera(this.sharedService.getFinanciera())
    .subscribe( data => {
      console.log(data);
      this.lisPrestamos = data;
      this.listaPrestamos = this.lisPrestamos.prestamos;
      console.log(this.listaPrestamos);
    })
  }

  obtenerSolicitudes(fecha:any){
    return new Promise<void>((resolve, reject) => {
    this.solicitudeService.getSolicitudesFinancieraDia(this.sharedService.getFinanciera(), fecha)
    .subscribe((data) => {
      console.log(data);
      this.lisSolicitudes = data;
      this.listaSolicitudes = this.lisSolicitudes.solicitudes;
      console.log(this.listaSolicitudes);
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

    for (let index = 0; index < this.listaPrestamos.length; index++) {   
            contador1 = contador1+this.listaPrestamos[index].pagoDiario;

            if (this.listaPrestamos[index].fechaPago!=fechaDelDia) {
             this.listaCuentasFaltantes.push(this.listaPrestamos[index]);
             contador3=contador3+this.listaPrestamos[index].pagoDiario;
            } 
            if (this.listaPrestamos[index].fechaPago==fechaDelDia) {
            this.listaCuentasPagadas.push(this.listaPrestamos[index]);
            contador4=contador4+this.listaPrestamos[index].pagoDiario;
            console.log("Contador 4");
            console.log(this.listaPrestamos[index]);
            }
            if (this.listaPrestamos[index].fecha==fechaDelDia) {
              this.listaPrestamosDelDia.push(this.listaPrestamos[index]);
              contador5=contador5+this.listaPrestamos[index].cantidadPrestamo;
            }


            contador2 = contador2 + this.listaPrestamos[index].totalRestante;
    }

    this.totalCobrarDia = contador1;
    this.contadorNumeroPrestamos = this.listaPrestamos.length;
    this.totalCartera = contador2;

    this.cuentasxCobrar=this.listaCuentasFaltantes.length;
    this.totalFaltante = contador3;
    this.cuentasCobradas=this.listaCuentasPagadas.length;
    this.totalCobrado =  contador4;
   // this.calcularPorcentaje(this.cuentasCobradas,this.contadorNumeroPrestamos);

   this.totalPrestamos = contador5;
   this.numeroPrestamos = this.listaPrestamosDelDia.length;
}

seleccionarPrestamosGestor(fechaDelDia: any, gestor:any){
  this.listaCuentasPagadas=[];
  this.listaCuentasFaltantes=[];
  this.listaPrestamosDelDia=[];
  let contador=0;
  let contador1=0;    
  let contador2=0;
  let contador3=0;
  let contador4=0;
  let contador5=0;

  for (let index = 0; index < this.listaPrestamos.length; index++) {   

    if(this.listaPrestamos[index].gestor==gestor)
    {
      contador1 = contador1+this.listaPrestamos[index].pagoDiario;
      contador=contador+1;

      if (this.listaPrestamos[index].fechaPago!=fechaDelDia) {
       this.listaCuentasFaltantes.push(this.listaPrestamos[index]);
       contador3=contador3+this.listaPrestamos[index].pagoDiario;
      } 
      if (this.listaPrestamos[index].fechaPago==fechaDelDia) {
      this.listaCuentasPagadas.push(this.listaPrestamos[index]);
      contador4=contador4+this.listaPrestamos[index].pagoDiario;
      console.log("El contador numero 4 muestra: "+contador4);
      }
      if (this.listaPrestamos[index].fecha==fechaDelDia) {
        this.listaPrestamosDelDia.push(this.listaPrestamos[index]);
        contador5=contador5+this.listaPrestamos[index].cantidadPrestamo;
      }
      contador2 = contador2 + this.listaPrestamos[index].totalRestante;
    }
          
  }

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
            sumaSolicitud=sumaSolicitud+this.listaSolicitudes[index].montoSolicitado;  
          }
          else{
            this.solicitudesEspecificas.push(this.listaSolicitudes[index]);
            sumaRenovacion=sumaRenovacion+this.listaSolicitudes[index].montoSolicitado;
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
      this.listaPagosEspecificos=[];
      for (let index = 0; index < this.listaPagos.length; index++) { 
        contador=contador+this.listaPagos[index].abono;
      }
      this.pagosDelDia=contador;

      this.listaPagosEspecificos=this.listaPagos;
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
      this.listaPagosEspecificos=[];
      for (let index = 0; index < this.listaPagos.length; index++) { 

        if(this.listaPagos[index].gestor==gestor)
        {
          contador=contador+this.listaPagos[index].abono;
          this.listaPagosEspecificos.push(this.listaPagos[index]);
        }
      }
      this.pagosDelDia=contador;
    })
    .catch(error => {
      console.error('Error al obtener Pagos:', error);
    });
}

sumarPagosGestorDia(fecha:any, gestor:any){

  this.obtenerPagos(fecha)
    .then(() => {
      let contador=0;
      this.listaPagosEspecificos=[];
      for (let index = 0; index < this.listaPagos.length; index++) { 

        if(this.listaPagos[index].gestor==gestor)
        {
          contador=contador+this.listaPagos[index].abono;
          this.listaPagosEspecificos.push(this.listaPagos[index]);
        }
      }
      this.pagosDelDia=contador;
    })
    .catch(error => {
      console.error('Error al obtener Pagos:', error);
    });
}

calcularPorcentaje(cantidad:any, total:any){
  this.porcentaje= String(Math.round((cantidad*100)/total));
  console.log("El porcentaje es: "+this.porcentaje);
}


}