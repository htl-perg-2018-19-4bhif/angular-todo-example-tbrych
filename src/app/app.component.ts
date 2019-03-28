import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';

interface IPerson {
  name: string;
};

interface ITodoItem {
  id: number;
  assignedTo?: string;
  description: string;
  done?: boolean
};

interface IEditItem {
  people: IPerson[],
  todo: ITodoItem
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  todos: ITodoItem[] = [];
  todosFilter: ITodoItem[] = [];
  people: IPerson[] = [];

  undoneChecked: boolean = false;
  selectedPerson: string = 'none';

  constructor(private http: HttpClient, public dialog: MatDialog){
    this.loadPeople();
  }

  async loadTodos(){
    this.todos = await this.http.get<ITodoItem[]>('http://localhost:8084/api/todos').toPromise();
    this.filterItems();
  }

  async getTodoArray(){
    this.todosFilter = await this.http.get<ITodoItem[]>('http://localhost:8084/api/todos').toPromise();
  }

  async loadPeople(){
    this.people = await this.http.get<IPerson[]>('http://localhost:8084/api/people').toPromise();
  }

  async delTodoServer(id: number){
    await this.http.delete(`http://localhost:8084/api/todos/${id}`).toPromise();
    await this.loadTodos();
  }

  async addTodo(todo: ITodoItem){
    if (todo.assignedTo != null && todo.assignedTo !== 'none'){
      await this.http.post('http://localhost:8084/api/todos', {
        "description": todo.description,
        "assignedTo": todo.assignedTo
      }).toPromise();
    } else {
      await this.http.post('http://localhost:8084/api/todos', {
        "description": todo.description
      }).toPromise();
    }

    this.loadTodos();
  }

  async updateTodo(todo: ITodoItem){
      await this.http.patch(`http://localhost:8081/api/todos/${todo.id}`, todo).toPromise();
  }

  async filterItems(){
    let todosFiltered: ITodoItem[] = [];

    await this.loadTodos();

    for (let i = 0; i < this.todos.length; i++){
      let curElement: ITodoItem = this.todos[i];
      let addCurElement: boolean = true;
      if (this.undoneChecked === true){
        if (curElement.done === true){
          addCurElement = false;
        }
      }
      if (this.selectedPerson !== 'none'){
        if (!curElement.assignedTo) {
          addCurElement = false;
        }else if (this.selectedPerson !== curElement.assignedTo) {
          addCurElement = false;
        }
      }

      if (addCurElement){
        todosFiltered.push(curElement);
      }
    }

    this.todos = todosFiltered;
  }

  showUndoneChanged(event){
    this.undoneChecked = event.checked;
    this.filterItems();
  }

  showSpecificPerson(event){
    this.selectedPerson = event.value;
    this.filterItems();
  }

  deleteTodo(id: number){
    this.delTodoServer(id);
  }

  openEdit(id: number){
    let curTodo: ITodoItem;

    this.todos.forEach(element => {
      if (element.id === id){
        curTodo = element;
      }
    });

    let data: IEditItem = {
      people: this.people,
      todo: curTodo
    }

    const dialogRef  = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: data
    });

    dialogRef .afterClosed().subscribe(todo => {
      if (todo != null) {
        this.updateTodo(todo);
      }
    });
  }

  openAdd() : void {
    const dialogRef  = this.dialog.open(AddDialogComponent, {
      width: '250px',
      data: this.people
    });

    dialogRef .afterClosed().subscribe(todo => {
      if (todo != null) {
        this.addTodo(todo);
      }
    });
  }
}
