import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Gestor } from '../interfaces/gestor';

const ApiURL = environment.url+'/api';


@Injectable({
  providedIn: 'root'
})
export class GestorServiceService {

  constructor(private http: HttpClient) { }

  guardarGestor(gestor: Gestor){

    return this.http.post(`${ApiURL }/gestores/`, gestor);
  }

  getGestorFinanciera(financiera:any)
  {
    return this.http.get(`${ ApiURL }/gestores/${financiera}`);
  }

  PutGestorFinanciera(id:any, data:any)
  {
    return this.http.put(`${ ApiURL }/gestores/${id}`, data);
  }

  DeleteGestorFinanciera(id:any)
  {
    return this.http.delete(`${ ApiURL }/gestores/${id}`);
  }

}
