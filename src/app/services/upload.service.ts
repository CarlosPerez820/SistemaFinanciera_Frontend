import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const ApiURL = environment.url+'/api';


@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('archivo', file);

    console.log(formData);
    console.log(file);

    return this.http
      .post(`${ ApiURL }/uploads/ruta/subruta/prueba`,formData)
      .toPromise();
  }

  uploadUpdateFile(file: File,id: any, coleccion: string, ruta:string, subruta:string, nombre:string, opcion:string): Promise<any> {
    const formData = new FormData();
    formData.append('archivo', file);

    console.log(formData);
    console.log(file);

    return this.http
      .put(`${ ApiURL }/uploads/${id}/${coleccion}/${ruta}/${subruta}/${nombre}/${opcion}`,formData)
      .toPromise();
  }

}