import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string, imageUrl: string }, // Recibe el mensaje y la imagen como datos
    private dialogRef: MatDialogRef<InfoDialogComponent>
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
