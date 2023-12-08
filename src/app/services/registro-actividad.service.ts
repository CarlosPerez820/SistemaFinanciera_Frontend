import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Gestor } from '../interfaces/gestor';

const ApiURL = environment.url+'/api';

@Injectable({
  providedIn: 'root'
})
export class RegistroActividadService {

  constructor(private http: HttpClient) { }


  getRegistroFinancieraGestor(financiera:any, gestor:any)
  {
    return this.http.get(`${ApiURL}/seguimientos/${financiera}/${gestor}`);
  }

  getRegistroFinancieraFecha(financiera:any, gestor:any, fecha:any)
  {
    return this.http.get(`${ApiURL}/seguimientos/${financiera}/${gestor}/${fecha}`);
  }


}
