import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

interface IPerson {
  name: string;
}

interface ITodoItem {
  description: string,
  assignedTo: string
}

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit {
  item: ITodoItem = {
    description: '',
    assignedTo: ''
  };
  valid: boolean;

  constructor(public dialogRef: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IPerson[]) { }

  ngOnInit() {
  }

  onCancel(){
    this.dialogRef.close();
  }

  checkValid(){
    console.log(this.item.description.length);
    this.valid = this.item.description.length > 0;
  }

}
