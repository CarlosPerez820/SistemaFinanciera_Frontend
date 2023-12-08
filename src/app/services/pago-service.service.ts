import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Pago } from '../interfaces/pago';

const ApiURL = environment.url+'/api';

@Injectable({
  providedIn: 'root'
})
export class PagoServiceService {

  constructor(private http: HttpClient) { }

  //Funciona y se utiliza
  getPagosFinanciera(financiera:any, fecha:any)
  {
    return this.http.get(`${ ApiURL }/pagos/${financiera}/${fecha}`);
  }

  //Funciona y se utiliza
  getPagosPrestamo(financiera:any, folio:any)
  {
    return this.http.get(`${ ApiURL }/pagos/prestamo/${financiera}/${folio}`);
  }

  //Funciona y se utiliza
  getPagosFinancieraFecha(financiera:any, fecha:any)
  {
    return this.http.get(`${ ApiURL }/pagos/${financiera}/${fecha}`);
  }

  //Funciona y se utiliza
  postPago(pago: Pago){

    return this.http.post(`${ ApiURL }/pagos/`, pago);
  }


}
