import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router'
import { catchError } from 'rxjs/internal/operators/catchError';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioServiceService } from 'src/app/services/usuario-service.service';

@Component({
  selector: 'app-registro-user',
  templateUrl: './registro-user.component.html',
  styleUrls: ['./registro-user.component.css']
})
export class RegistroUserComponent {
  form: FormGroup;
  errorMessage: any;

  planes: any[] = [
    {value: 'Basico', viewValue: 'Basico'},
    {value: 'Intermedio', viewValue: 'Intermedio'},
    {value: 'Premium', viewValue: 'Premium'},
  ];

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private router: Router,
              private usuarioService: UsuarioServiceService
              )
  {
    this.form=this.fb.group({
      nombre: ['',Validators.required],
      correo: ['',Validators.required],
      telefono: ['',Validators.required],
      password: ['',Validators.required],
      sucursal: ['',Validators.required],
      membresia: ['',Validators.required]
    })
  }

  ngOnInit(): void{}

  registrar(){
    console.log(this.form);
    const correo = this.form.value.correo.toLowerCase();
    const pass = this.form.value.password;

    const regexCorreo = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (regexCorreo.test(correo)) 
    {
      if (pass.length > 6) {
        this.registrarUsuario();
      }
      else{
        this.error("La contraseña debe tener mas de 6 caracteres");
      }
    } else {
        this.error("El correo no es valido");
      }
  }

  registrarUsuario(){
    const user: Usuario = {
      nombre: this.form.value.nombre,
      correo: this.form.value.correo.toLowerCase(),
      telefono:this.form.value.telefono,
      password: this.form.value.password,
      rol: "SUCURSAL_ROLE",
      sucursal: this.form.value.sucursal.toLowerCase(),
      membresia: this.form.value.membresia,
    }

    this.usuarioService.guardarCliente(user).pipe(
      catchError((error) => {
        console.error('Error en el registro:', error);
        if (error.error && error.error.errors && error.error.errors.length > 0) {
          this.errorMessage = error.error.errors[0].msg;
          console.log(this.errorMessage);
          this.error(this.errorMessage);
        } else {
          this.errorMessage = 'Error desconocido'; 
          console.log(this.errorMessage);
          this.error(this.errorMessage);
        }
        throw error;
      })
    ).subscribe((data) => {
      if(data){
        alert("usuario "+ this.form.value.correo + " registrado exitosamente.");
        this.router.navigate(['/login']);
      }
    });

  }

  error(mensaje: string){
    this._snackBar.open(mensaje,'',{
        duration:5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
    })
  }

}
