import { Component, OnInit, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import lowdb from 'lowdb';
import { default as FileAsync } from 'lowdb/adapters/FileAsync';

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

  }

  AddNewTask() {
    this.dialog.open(AddTaskDialog, {
      width: '500px',
      height: '80vh',
      data: {
        animal: 'panda'
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
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}