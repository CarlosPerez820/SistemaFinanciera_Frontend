import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Parametro } from '../interfaces/parametro';

const ApiURL = environment.url+'/api';

@Injectable({
  providedIn: 'root'
})
export class ParametroServiceService {

  constructor(private http: HttpClient) { }

  guardarParametros(parametro: Parametro){

    return this.http.post(`${ApiURL }/parametros/`, parametro);
  }

  getParametrosFinanciera(financiera:any)
  {
    return this.http.get(`${ ApiURL }/parametros/${financiera}`);
  }

  PutParametrosFinanciera(id:any, data:any)
  {
    return this.http.put(`${ ApiURL }/parametros/${id}`, data);
  }

}
