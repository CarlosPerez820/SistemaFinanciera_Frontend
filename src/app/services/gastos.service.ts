import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Gasto } from '../interfaces/gasto';

const ApiURL = environment.url+'/api';

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  constructor(private http: HttpClient) { }

  postPago(gasto: Gasto){

    return this.http.post(`${ ApiURL }/gastos/`, gasto);
  }

  getGastosFinancieraFecha(financiera:any, fechaInicio:any, fechaFin:any)
  {
    return this.http.get(`${ ApiURL }/gastos/${financiera}/${fechaInicio}/${fechaFin}`);
  }


}
