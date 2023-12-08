import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-renovacion-cliente',
  templateUrl: './renovacion-cliente.component.html',
  styleUrls: ['./renovacion-cliente.component.css']
})
export class RenovacionClienteComponent {

  form: FormGroup;

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

  constructor(private fb: FormBuilder){
    this.form = this.fb.group({
      usuario: ['',Validators.required],
      nombre: ['',Validators.required],
      edad: ['',Validators.required],
      sexo: ['',Validators.required],
    })
  }

  agregarUsuario(){
    console.log(this.form);
  }

  openInput(){ 
    document.getElementById("fileInput")!.click();
  }

}