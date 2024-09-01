import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Clientes,ApiResponse } from '../interfaces/clientes';
import { Observable } from 'rxjs/internal/Observable';

const ApiURL = environment.url+'/api';

@Injectable({
  providedIn: 'root'
})
export class ClienteServiceService {

  constructor(private http: HttpClient) { }


    busquedaCliente(valor:any){
      return this.http.get(`${ApiURL}/buscar/${valor}`); 
    }

    busquedaClienteNumero(valor:any){
      return this.http.get(`${ApiURL}/buscar/cliente/${valor}`); 
    }

    //Get Financiera - Funciona
    getBuroClientes()
    {
      return this.http.get(`${ApiURL}/clientes/buro`);
    }

    //Get Financiera - Funciona
    getClientesFinanciera(financiera:any)
    {
      return this.http.get(`${ApiURL}/clientes/${financiera}`);
    }
  

    //Get Financiera con Numero de Cliente- Funciona
    getClientesPorNumeroFinanciera(financiera:any, nCliente:any)
    {
      return this.http.get(`${ApiURL}/clientes/numero/${financiera}/${nCliente}`);
    }

    //Get Especifico  - Funciona
    getClienteEspecifico(id: string)
    {
      return this.http.get(`${ApiURL}/clientes/especifico/${id}`);
    }
  
    //Post Cliente Funciona
    guardarCliente(cliente: Clientes): Observable<ApiResponse> {
      return this.http.post<ApiResponse>(`${ApiURL}/clientes/`, cliente);
    }

    PutClienteFinanciera(id:any, data:any)
    {
      return this.http.put(`${ ApiURL }/clientes/${id}`, data);
    }

    DeleteClienteFinanciera(id:any)
    {
      return this.http.delete(`${ApiURL}/clientes/${id}`);
    }

}
