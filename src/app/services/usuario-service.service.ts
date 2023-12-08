import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/usuario';

const ApiURL = environment.url+'/api';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceService {

  constructor(private http: HttpClient) { }

  guardarCliente(usuario: Usuario){

    return this.http.post(`${ApiURL }/usuarios/`, usuario);
  }

}
