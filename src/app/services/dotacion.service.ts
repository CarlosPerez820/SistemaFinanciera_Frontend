import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Dotacion } from '../interfaces/dotacion';

const ApiURL = environment.url+'/api';

@Injectable({
  providedIn: 'root'
})
export class DotacionService {

  constructor(private http: HttpClient) { }

  postDotacion(dotacion: Dotacion){

    return this.http.post(`${ ApiURL }/dotacion/`, dotacion);
  }

  getDotacionFecha(financiera:any, dia:any)
  {
    return this.http.get(`${ ApiURL }/dotacion/${financiera}/${dia}`);
  }

  getDotacionGestor(financiera:any, usuario:any)
  {
    return this.http.get(`${ ApiURL }/dotacion/responsable/${financiera}/${usuario}`);
  }


}
