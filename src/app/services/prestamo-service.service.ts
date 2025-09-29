import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Prestamo } from '../interfaces/prestamo';

const ApiURL = environment.url+'/api';

@Injectable({
  providedIn: 'root'
})
export class PrestamoServiceService {

  constructor(private http: HttpClient) { }

  guardarPrestamo(prestamo: Prestamo){

    return this.http.post(`${ApiURL }/prestamos/`, prestamo);
  }

  getPrestamosCliente(financiera:any, cliente:any)
  {

    return this.http.get(`${ ApiURL }/prestamos/${financiera}/${cliente}`);
  }

  getPrestamosValidosFinanciera(financiera:any)
  {
    return this.http.get(`${ ApiURL }/prestamos/validos/${financiera}`);
  }

  getPrestamoEspecifico(id:any)
  {
    return this.http.get(`${ ApiURL }/prestamos/especifico/${id}`);
  }

  getPrestamoPorDia(financiera:any, fechaInicio:any)
  {
    return this.http.get(`${ ApiURL }/prestamos/pordia/${financiera}/${fechaInicio}`);
  }


  PutPrestamoFinanciera(id:any, data:any)
  {
    return this.http.put(`${ ApiURL }/prestamos/${id}`, data);
  }

  //Funciona Prestamos de un dia
  getPrestamosDia(financiera:any, fecha:any)
  {
    return this.http.get(`${ URL }/api/prestamos/pordia/${financiera}/${fecha}`);
  }

  /*DeleteGestorFinanciera(id:any)
  {
    return this.http.delete(`${ ApiURL }/gestores/${id}`);
  }*/

}
