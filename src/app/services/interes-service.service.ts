import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Interes } from '../interfaces/interes';

const ApiURL = environment.url+'/api';


@Injectable({
  providedIn: 'root'
})
export class InteresServiceService {

  constructor(private http: HttpClient) { }

  guardarInteres(interes: Interes){

    return this.http.post(`${ApiURL }/interes/`, interes);
  }

  getinteresFinanciera(financiera:any)
  {
    return this.http.get(`${ ApiURL }/interes/${financiera}`);
  }


  DeleteInteresFinanciera(id:any)
  {
    return this.http.delete(`${ ApiURL }/interes/${id}`);
  }

}
