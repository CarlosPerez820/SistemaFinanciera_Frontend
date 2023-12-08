import { Component } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private sharedService: SharedService){}

  ngOnInit(): void{
    console.log(" Hola mundo Dashboard");
    this.sharedService.decodificar();
    console.log(this.sharedService.getFinanciera());
  }

}
