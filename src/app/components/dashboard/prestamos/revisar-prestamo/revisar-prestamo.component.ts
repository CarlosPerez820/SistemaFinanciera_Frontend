import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { GestorServiceService } from 'src/app/services/gestor-service.service';
import { PrestamoServiceService } from 'src/app/services/prestamo-service.service';
import { Prestamo } from 'src/app/interfaces/prestamo';
import { UploadService } from 'src/app/services/upload.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { InfoDialogComponent } from 'src/app/components/info-dialog/info-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  selector: 'app-revisar-prestamo',
  templateUrl: './revisar-prestamo.component.html',
  styleUrls: ['./revisar-prestamo.component.css']
})
export class RevisarPrestamoComponent {

  fecha_Solicitud: string =fechaDia;
  form: FormGroup;
  mongoIdPrestamo:any;
  lista: any =[];
  listaGestores: any =[];
  lista2: any = [];
  prestamoEspecifico: any =[];

  //barra de progeso
  subiendoArchivo: boolean = false; // Controla la visibilidad de la barra de progreso
  progreso: number = 0; // Valor de progreso para la barra
  

  viviendas: any[] = [
    {value: 'Propia', viewValue: 'Propia'},
    {value: 'Rentada', viewValue: 'Rentada'},
    {value: 'Familiar', viewValue: 'Familiar'},
  ];

  gestores: any[] = [
    {value: 'gestor1', viewValue: 'gestor1'},
    {value: 'gestor2', viewValue: 'gestor2'},
    {value: 'gestor3', viewValue: 'gestor3'},
  ];

  constructor(private fb: FormBuilder,  private route: ActivatedRoute, private gestorService: GestorServiceService, 
              private prestamoService: PrestamoServiceService, private sharedService: SharedService,
              private imageCompress: NgxImageCompressService, private uploadService: UploadService,
              private router: Router, private dialog: MatDialog){
    this.form = this.fb.group({
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
      comentario: ['',Validators.required],
      tipoPrestamo: ['', Validators.required],
    })
  }

  ngOnInit(): void{
    this.mongoIdPrestamo = this.route.snapshot.paramMap.get("id");
    console.log(this.mongoIdPrestamo);
    this.obtenerGestores();
    this.obtenerPrestamo();
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
    })
  }

  llenarFormulario(){
    console.log(this.prestamoEspecifico.nombre);
    this.form.patchValue({
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
      comentario: this.prestamoEspecifico.nota,
      tipoPrestamo: this.prestamoEspecifico.tipoPrestamo,
    });
  }

  editarPrestamo(){
    let fechSiguiente='xx-xx-xx';

    if(this.form.value.tipoPrestamo=='Semanal'){
      fechSiguiente=this.calcularProximoPago();
    }

    const prestamo: Prestamo = {
      fechaPago: this.fecha_Solicitud,
      gestor: this.form.value.gestor,
      estatus: 'Activo',
      proximoPago: fechSiguiente,
    }
    console.log(prestamo);

    this.prestamoService.PutPrestamoFinanciera(this.mongoIdPrestamo, prestamo).subscribe(data => {
      if(data){
        console.log(data);
        this.openDialog("El Prestamo esta iniciado, asegurase de registrar los pagos correspondientes", "assets/img/exito.png");
        this.router.navigate(['dashboard/prestamos']);

      }
    }, (error: any) => {
      console.log(error);
      this.openDialog("Sucedio un error: "+error, "assets/img/error.png");
    })
  }

  calcularProximoPago(): string {
    //let fechaInicia: Date = new Date(this.fecha_Solicitud); 
    const ultimaFechaPago = new Date(); ;
    const proximoPago = new Date(ultimaFechaPago);
    proximoPago.setDate(ultimaFechaPago.getDate() + 7);

    const dia = proximoPago.getDate();
    const mes = proximoPago.getMonth() + 1;
    const anio = proximoPago.getFullYear();

    const fechaFormateada = `${dia}-${mes}-${anio}`;

    return fechaFormateada;
  }

  onFileSelected(event: any, tipo:any) {
    const file = event.target.files[0];

    if (file) {
      console.log("tipo en Seleccionar el archivo "+tipo);
      this.subirArchivo(file, tipo);
    }
  }

  compresklsImage(file: File, tipo:any) {
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


  subirArchivo(file: File, tipo:any){
    console.log("tipo en subir archivo "+tipo);
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


  openInput(){ 
    document.getElementById("fileInput")!.click();
  }
  openInput2(){ 
    document.getElementById("fileInput2")!.click();
  }
  openInput3(){ 
    document.getElementById("fileInput3")!.click();
  }


}

