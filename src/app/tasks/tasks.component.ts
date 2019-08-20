import { Component, OnInit, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as lowdb from 'lowdb';
import * as LocalStorage from 'lowdb/adapters/LocalStorage'
import { FormGroup, FormControl } from '@angular/forms';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.sass']
})
export class TasksComponent implements OnInit {
  date = new Date();
  private db;
  movies = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi'
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.initDatabase();
  }

  private async initDatabase() {
    const adapter = new LocalStorage("db.json");
    this.db = lowdb(adapter);
  }

  AddNewTask() {
    this.dialog.open(AddTaskDialog, {
      width: '500px',
      height: '80vh',
      data: {
        db: this.db
      }
    });
  }

}


@Component({
  selector: 'add-task-dialog-dialog',
  templateUrl: 'add-task-dialog.html',
  styleUrls: ['./tasks.component.sass']
})
export class AddTaskDialog {

  newTaskForm = new FormGroup({
    task: new FormControl(''),
    detalle: new FormControl(''),
    vencimiento: new FormControl(''),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  CreateTask() {
    console.log(this.newTaskForm.get('vencimiento').value)
    this.data.db.get('posts')
      .push({ 
          task: this.newTaskForm.get('task').value
        , detalle: this.newTaskForm.get('detalle').value
        , vencimiento: this.newTaskForm.get('vencimiento').value 
      })
      .write()
  }
}