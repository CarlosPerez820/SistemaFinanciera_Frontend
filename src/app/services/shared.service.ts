import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode'
import { DecodedToken } from '../interfaces/decode';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private authService:AuthServiceService) { }

  public correo: string | undefined;
  public nombre: string | undefined;
  public financiera: string | undefined;
  public _idUsuario: string | undefined;
  public nombreCliente: string = "dinero facil";

  decodificar(){
    const token = this.authService.getToken();

    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);

      this.correo = decodedToken.usuario;
      this.financiera = decodedToken.sucursal;
      this._idUsuario = decodedToken.uid;
      this.nombre = decodedToken.nombre;

    } else {
      console.log("No existe JWT");
    }
  }

  getCorreo() {
    return this.correo;
  }

  getNombre() {
    return this.nombre;
  }

  getFinanciera() {
    return this.financiera;
  }

  getID() {
    return this._idUsuario;
  }

  getSucursalCliente(){
    return this.nombreCliente;
  }

}
