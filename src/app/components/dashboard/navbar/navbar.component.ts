import { Component, EventEmitter, Output } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  nombreFinanciera = "";

  constructor(private sharedService: SharedService){}

  isMenuOpen = false;

  ngOnInit(): void{
    this.nombreFinanciera = this.sharedService.getFinanciera() ??'FN';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  cerrarSesion(){
    localStorage.removeItem('token');
  }
}
