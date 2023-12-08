import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

const ApiURL = environment.url+'/api';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private _isAuthenticated: boolean = false; 

  constructor(private http: HttpClient) { }

  public isAuthenticated(): boolean {

    const token = localStorage.getItem('token'); 
    return !!token;

  }

  setAuthenticated(){
    this._isAuthenticated = true;
    console.log(this._isAuthenticated);
  }

  login(correo: string, password: string): Observable<any> {
    const body = {
      correo: correo,
      password: password,
    };

    return this.http.post(`${ApiURL}/auth/login`, body);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
