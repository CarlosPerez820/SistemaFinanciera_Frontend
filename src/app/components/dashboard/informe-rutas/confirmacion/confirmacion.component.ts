import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GestorServiceService } from 'src/app/services/gestor-service.service';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.css']
})
export class ConfirmacionComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
            private gestorService: GestorServiceService, 
            public dialogRef: MatDialogRef<ConfirmacionComponent>) {}

  ngOnInit(): void{
    console.log(this.data.parametro_id);
  }

  eliminarGestor(){
    this.dialogRef.close('confirmar');
  }

  cerrarMat(){
    this.dialogRef.close();
  }

}
