import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Interes } from 'src/app/interfaces/interes';
import { InteresServiceService } from 'src/app/services/interes-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { ParametroServiceService } from 'src/app/services/parametro-service.service';
import { Parametro } from 'src/app/interfaces/parametro';
import { UploadService } from 'src/app/services/upload.service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.css']
})
export class AjustesComponent {

  panelOpenState = false;
  form: FormGroup;
  form2: FormGroup;
  lista: any;
  listaDeInteres: any=[];
  lista2:any;
  listaParametros:any=[];
  listaTasaSemanal: any=[];
  listaTasaDiaria: any=[];
  urlImagen = 'assets/img/config.png';
  extensionesPermitidas = ['jpg', 'png', 'jpeg'];

  displayedColumns: string[] = ['inferior', 'superior', 'porcentaje','acciones'];
  dataSource = new MatTableDataSource(this.listaTasaDiaria);
  dataSource2 = new MatTableDataSource(this.listaTasaSemanal);

  tipoPrestamos: any[] = [
    {value: 'Diario', viewValue: 'Prestamo por dias'},
    {value: 'Semanal', viewValue: 'Prestamo por Semanas'},
  ];

  constructor(private fb: FormBuilder, private sharedService: SharedService, private interesService: InteresServiceService,
    private imageCompress: NgxImageCompressService, private parametroService: ParametroServiceService, private uploadService: UploadService){
    this.form = this.fb.group({
      lSuperior: ['',Validators.required],
      lInferior: ['',Validators.required],
      porcentaje: ['',Validators.required],
      tipo: ['', Validators.required],
    })
    this.form2 = this.fb.group({
      mora: ['',Validators.required],
      moraSemanal: ['', Validators.required],
    })  
  }

  ngOnInit(): void{
    this.obtenerListaDeInteres();
    this.obtenerParametos();
  }


  obtenerListaDeInteres() {
    this.interesService.getinteresFinanciera(this.sharedService.getFinanciera()).subscribe(
      (data) => {
        //console.log(data);
        this.lista = data;
        this.listaDeInteres = this.lista.intereces;
        console.log(this.listaDeInteres);

        this.seleccionarTasas();
      },
      (error) => {
        console.error('Error al obtener la lista de precios:', error);
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
    this.dataSource = new MatTableDataSource(this.listaTasaDiaria);
    this.dataSource2 = new MatTableDataSource(this.listaTasaSemanal);
  }

  obtenerParametos(){
    this.parametroService.getParametrosFinanciera(this.sharedService.getFinanciera()).subscribe(
      (data) => {
        //console.log(data);
        this.lista2 = data;
        this.listaParametros = this.lista2.parametros;
        console.log(this.listaParametros[0]);

        if(this.listaParametros[0]){
          this.urlImagen = 'https://node-restserver-financiera-production.up.railway.app/' + this.listaParametros[0].urlLogo;
        }
      },
      (error) => {
        console.error('Error al obtener la lista de los parametros:', error);
      });
  }

  agregarInteres(){
    console.log(this.form);

    const interes: Interes ={
      sucursal: this.sharedService.getFinanciera(),
      tipo: this.form.value.tipo,
      limiteInferior: this.form.value.lInferior,
      limiteSuperior: this.form.value.lSuperior,
      porcentaje: this.form.value.porcentaje,
    }

    this.interesService.guardarInteres(interes).subscribe(response => {

      if(response){
        console.log("Registro de interes exitoso");
        console.log(response);
        alert("Registro exitoso");
        this.form.reset(); 
        this.obtenerListaDeInteres();
      }
    }, error => {
      console.log(error); 
      alert("No se pudo registrar la tasa de interes, vuelva a intentarlo");
    });
  }

  registrarParametros(){
    if(this.listaParametros.length>0){
        this.editarParametros();
    }
    else{
      this.guardarParametro();
    }
  }

  editarParametros(){
    console.log("Editar parametro"+this.listaParametros[0]._id);

    const parametro: Parametro ={
      montoMora: this.form2.value.mora, 
      horaLimite: this.form2.value.hora,
    }

    this.parametroService.PutParametrosFinanciera(this.listaParametros[0]._id,parametro).subscribe(response => {
      if(response){
        console.log(response);
        alert("Datos Almacenados");
        this.form2.reset(); 
        this.obtenerParametos();
      }
    }, error => {
      console.log(error); 
      alert("No se pudieron Guardar los datos");
    });
  }

  guardarParametro(){
    const parametro: Parametro ={
      urlLogo: 'URL',
      montoMora: this.form2.value.mora, 
      horaLimite: '0:0',
      MoraSemanal: this.form2.value.moraSemanal,
      tipoCobro: 'Mixto',
      idAdministrador: this.sharedService.getID(),
      sucursal: this.sharedService.getFinanciera(),
    }

    this.parametroService.guardarParametros(parametro).subscribe(response => {
      if(response){
        console.log(response);
        alert("Datos Almacenados");
        this.form2.reset(); 
        this.obtenerParametos();
      }
    }, error => {
      console.log(error); 
      alert("No se pudieron Guardar los datos");
    });
  }
  
  eliminarInteres(id:any){
    this.interesService.DeleteInteresFinanciera(id).subscribe(response => {

      if(response){
        console.log(response);
        alert("Se elimino correctamente");
        this.obtenerListaDeInteres();
      }
    }, error => {
      console.log(error); 
      alert("No se pudo eliminar");
    });  
  }

  openInput(){ 
    document.getElementById("fileInput")!.click();
  }


  onFileSelected(event: any, tipo:any) {
    const file = event.target.files[0];

    if(this.listaParametros.length>0){
      if (file) {
        console.log("tipo en Seleccionar el archivo "+tipo);
       // this.compressImage(file, tipo);
        let extension = file.name.split('.').pop();
        if(this.extensionesPermitidas.includes(extension)){
          this.subirArchivo(file, tipo);
        }
        else{
          alert("Tipo de archivo no valido, favor de seleccionar una imagen");
        }
      }
    }
    else{
      alert("primero registra la informacion y despues sube tu logo");
    }
    
  }

  compressImage(file: File, tipo:any) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      console.log("Comprimiendo .......");
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
    const _sucursalFinanciera = this.sharedService.getFinanciera()??'vacio';
    const nombreArchivo = tipo+'_'+_sucursalFinanciera;

    if (file) {
      this.uploadService.uploadUpdateFile(file,this.listaParametros[0]._id,'parametros',_sucursalFinanciera,'parametros',nombreArchivo,tipo).then((response) => {
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


}


