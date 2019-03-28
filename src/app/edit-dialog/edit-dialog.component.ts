import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

interface IPerson {
  name: string;
};

interface ITodoItem {
  description: string,
  assignedTo: string
};

interface IEditItem {
  people: IPerson[],
  todo: ITodoItem
};

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IEditItem) { }

  ngOnInit() {
  }

}
