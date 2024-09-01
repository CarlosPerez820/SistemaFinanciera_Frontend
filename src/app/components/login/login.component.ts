import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private router: Router, private authService: AuthServiceService){
    this.form=this.fb.group({
      usuario: ['',Validators.required],
      password: ['',Validators.required]
    })
  }

  ngOnInit(): void{
    //console.log("HolaMundo");
  }

  ingresar(){
    const usuario = this.form.value.usuario.toLowerCase();
    const pass = this.form.value.password;

    this.authService.login(usuario, pass)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.errorLogin();
            console.error('Error HTTP 400:', error.error);

          } else {
            console.error('Error:', error);
          }
          return throwError(error);
        })
      )
      .subscribe(
        (response) => {
          if (response && response.token) {
            console.log(response);
          //  this.authService.setAuthenticated();
            localStorage.setItem('token', response.token);
            this.router.navigate(['/dashboard']);

          }
      },
      (error) => {
     
      });
/*
    if(usuario == "admin" && pass =="admin"){
      //this.loading=true;
      this.animacionLogeo();
    }
    else{
      this.error();
      this.form.reset();
    }*/
  }

  errorLogin(){
    this._snackBar.open("Correo y/o contraseña invalida",'',{
        duration:5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
    })
  }

  animacionLogeo(){
    this.loading = true;
    setTimeout(() => {
      
      //Ruta de Dashboard
      this.router.navigate(['dashboard']);
    }, (2000));
  }

}
