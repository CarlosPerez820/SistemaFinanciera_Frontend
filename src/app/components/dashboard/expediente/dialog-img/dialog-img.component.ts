import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

const url_server = environment.url+"/";


@Component({
  selector: 'app-dialog-img',
  templateUrl: './dialog-img.component.html',
  styleUrls: ['./dialog-img.component.css']
})
export class DialogImgComponent {

  urlImagen: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void{
    this.urlImagen=this.data.parametro_url;
    console.log(this.urlImagen);

  }


}
