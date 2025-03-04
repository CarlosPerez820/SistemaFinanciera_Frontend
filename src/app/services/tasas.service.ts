import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TasasService {

  constructor() { }

  tasasTradicional: any[] = [
    { dia: 5, interes: 10 },
    { dia: 10, interes: 15 },
    { dia: 15, interes: 20 },
    { dia: 20, interes: 25 },
    { dia: 25, interes: 30 },
    { dia: 30, interes: 35 }
  ];

  tasasBlindage: any[] = [
    { dia: 6, interes: 5 },
    { dia: 12, interes: 10 },
    { dia: 18, interes: 15 },
    { dia: 24, interes: 20 },
    { dia: 30, interes: 25 }
  ];
  
  prestamos: any[] = [
    {value: 'tradicional', viewValue: 'Tradicional'},
    {value: 'blindaje', viewValue: 'Blindaje'},
  ];

  getTasasTradicional() {
    return this.tasasTradicional;
  }

  getTasasBlindage() {
    return this.tasasBlindage;
  }

  getTipoPrestamos() {
    return this.prestamos;
  }

}
