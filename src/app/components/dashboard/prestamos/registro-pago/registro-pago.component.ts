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

  lista4:any=[];
  clienteEspecifico:any=[];

  viviendas: any[] = [
    {value: 'Propia', viewValue: 'Propia'},
    {value: 'Rentada', viewValue: 'Rentada'},
    {value: 'Familiar', viewValue: 'Familiar'},
  ];

  constructor(private fb: FormBuilder,  private route: ActivatedRoute, private gestorService: GestorServiceService, 
              private prestamoService: PrestamoServiceService, private sharedService: SharedService, private pagoService:PagoServiceService,
              private router: Router, private clienteService:ClienteServiceService){
    this.form = this.fb.group({
      totalRestante: ['',Validators.required],      
      montoPagado: ['',Validators.required],      
      numeroCliente: ['',Validators.required],
      fecha: ['',Validators.required],
      montoAutorizado: ['',Validators.required],
      totalPagar: ['',Validators.required],
      pagoDiario: ['',Validators.required],
      plazo: ['',Validators.required],
      nombreSolicitante: ['',Validators.required],
      direccion: ['',Validators.required],
      colonia: ['',Validators.required],
      celular: ['',Validators.required], 
      gestor: ['',Validators.required],
    })
  }

  ngOnInit(): void{
    this.mongoIdPrestamo = this.route.snapshot.paramMap.get("id");
    console.log(this.mongoIdPrestamo);
    this.obtenerGestores();
    this.obtenerPrestamo();
  }

  registrarPagos(){

    let folioPago ="PAG-"+year+month+day+hour+minutes+segundes+mili;
    let _horaActual = `${hour}:${minutes}`;
    this.totalRestante = this.prestamoEspecifico.totalRestante - this.form.value.montoPagado;

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
      abono: this.form.value.montoPagado,
      personasCobrador: 'Oficina',
      sucursal: this.sharedService.getFinanciera(),
    }

    console.log(pago);

    this.pagoService.postPago(pago).subscribe(
      (response) => {
      this.actualizarPrestamo();
      this.actualizarCliente();
      console.log('Pago registrado con éxito:');
      console.log(response);
      alert("Pago registrado con exito");
      this.router.navigate(['dashboard/prestamos']);
    },
    (error) => {
      console.error('Error al registrar Pago:', error);
      alert("Hay problemas al registrar el pago");
    });
  }

  buscarCliente(){
    this.clienteService.getClientesPorNumeroFinanciera(this.sharedService.getFinanciera(), this.prestamoEspecifico.numeroCliente)
    .subscribe( data => {
      //console.log(data);
      this.lista4 = data;
      this.clienteEspecifico = this.lista4.clientes;
      //console.log("CLinete:---");
      //console.log(this.clienteEspecifico[0]);
    })
  }

  actualizarCliente(){
    let activos=this.clienteEspecifico[0].numeroACtivos;

    if(this.totalRestante<=0){
      activos=activos-1;
    }
    const cliente: Clientes={
      puntuacion: '0',
      numeroActivos: activos,
    }
    this.clienteService.PutClienteFinanciera(this.clienteEspecifico[0]._id, cliente).subscribe(data => {
      if(data){
        console.log(data);
      }
    }, (error: any) => {
      console.log(error);
      alert("Problemas al actualizar al cliente, intente mas tarde");
    });
  }

  actualizarPrestamo(){
    let estatusPrestamo = "Activo";
    if(this.totalRestante<=0){
      estatusPrestamo="Finalizado";
    }

    const prestamo: Prestamo = {
      fechaPago: this.fecha_Solicitud,
      totalRestante:this.totalRestante,
      gestor: this.form.value.gestor,
      estatus: estatusPrestamo,
      tipoUltiPago: 'Pago',
    }
    console.log(prestamo);

    this.prestamoService.PutPrestamoFinanciera(this.mongoIdPrestamo, prestamo).subscribe(data => {
      if(data){
        console.log(data);
        this.router.navigate(['dashboard/prestamos']);

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
      console.log(this.listaPagos);
    })
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

  obtenerPrestamo(){
    this.prestamoService.getPrestamoEspecifico(this.mongoIdPrestamo)
    .subscribe( data => {
      console.log(data);
      this.lista2 = data;
      this.prestamoEspecifico = this.lista2.prestamo;
      console.log(this.prestamoEspecifico);
      this.llenarFormulario();
      this.obtenerPagos();
      this.buscarCliente();
    })
  }

  llenarFormulario(){
    console.log(this.prestamoEspecifico.nombre);
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
    });
  }

  agregarUsuario(){
    console.log(this.form);
  }

}

