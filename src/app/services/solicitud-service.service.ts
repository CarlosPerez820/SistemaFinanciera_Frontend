import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Solicitudes } from '../interfaces/solicitud';

const ApiURL = environment.url+'/api';


@Injectable({
  providedIn: 'root'
})
export class SolicitudServiceService {

  constructor(private http: HttpClient) { }

  getSolicitudFinanciera(financiera:any)
  {
    return this.http.get(`${ApiURL}/solicitudes/${financiera}`);
  }

  getSolicitudFinancieraValidos(financiera:any)
  {
    return this.http.get(`${ApiURL}/solicitudes/validos/${financiera}`);
  }

  getSolicitudFinancieraTipos(financiera:any, tipoSolicit: any)
  {
    return this.http.get(`${ApiURL}/solicitudes/tipo/${financiera}/${tipoSolicit}`);
  }

  getSolicitudEspecifico(id: string)
  {
    return this.http.get(`${ApiURL}/solicitudes/especifico/${id}`);
  }

  getSolicitudesFinancieraDia(financiera: any, dia:any)
  {
    return this.http.get(`${ ApiURL }/solicitudes/${financiera}/${dia}`);
  }

  guardarSolicitud(solicitud: Solicitudes){

    return this.http.post(`${ApiURL}/solicitudes/`, solicitud);
  }

  PutSolicitudFinanciera(id:any, data:any)
  {
    return this.http.put(`${ ApiURL }/solicitudes/${id}`, data);
  }

}