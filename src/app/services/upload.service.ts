import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
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

  uploadUpdateFile2(
    file: File,
    id: any,
    coleccion: string,
    ruta: string,
    subruta: string,
    nombre: string,
    opcion: string,
    progressCallback: (progress: number) => void  // Agregar un callback para el progreso
  ): Promise<any> {
    const formData = new FormData();
    formData.append('archivo', file);

    const req = new HttpRequest('PUT', `${ApiURL}/uploads/${id}/${coleccion}/${ruta}/${subruta}/${nombre}/${opcion}`, formData, {
      reportProgress: true,  // Habilitar reporte de progreso
      responseType: 'json'
    });

    return new Promise((resolve, reject) => {
      this.http.request(req).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            // Calcula el porcentaje de progreso
            const progress = Math.round((100 * event.loaded) / (event.total ?? 1));
            progressCallback(progress);  // Llama al callback con el progreso
          } else if (event.type === HttpEventType.Response) {
            resolve(event.body);  // Resuelve la promesa con la respuesta de la API
          }
        },
        error => {
          reject(error);  // Rechaza la promesa si hay un error
        }
      );
    });
  }

}