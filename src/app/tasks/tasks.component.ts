import { Component, OnInit, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpService } from '../services/http.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.sass']
})
export class TasksComponent implements OnInit {
  date = new Date();
  private db;
  tasks = [];
  disableDrag = false;
  selectedTask = [];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }

  constructor(public dialog: MatDialog, private httpClient: HttpService) { }

  ngOnInit() {
    this.GetTasks();
  }

  Check(task: any) {
    if(this.selectedTask.find(anytask => anytask.id == task.id) == undefined) {
      this.selectedTask.push(task);
    } else {
      this.selectedTask.splice(this.selectedTask.findIndex(anytask => anytask.id == task.id), 1);
    }
  }
  
  LiberarTareas() {
    this.selectedTask.forEach((task, index) => {
      task.status = 'liberada';
      this.httpClient.UpdateTask(task)
        .then(res => {
          if(index == this.selectedTask.length - 1) {
            Swal.fire(
              'Tareas liberadas',
              'Continue para visualizar sus tareas restantes.',
              'success'
            );
            this.selectedTask = [];
          }
        });
    });
  }

  Drag() {
    this.disableDrag = !this.disableDrag;
  }

  AddNewTask() {
    let dialogOpened = this.dialog.open(AddTaskDialog, {
      width: '500px',
      height: '80vh',
      data: {
        httpClient: this.httpClient
      }
    });

    dialogOpened.afterClosed().subscribe(res => {
      this.GetTasks();
    })
  }

  GetTasks() {
    this.httpClient.GetTasks()
      .then(data => {
        this.tasks = data;
        this.tasks.forEach(element => {
          element.duedate = new Date(element.duedate);
          element.createddate = new Date(element.createddate);
        });
      })
  }

  Ordenar(sort: any) {
    switch(sort) {
      case 'FechaVencimiento':
        this.tasks.sort(function (a, b) {
          var keyA = new Date(Date.parse(a.duedate)),
            keyB = new Date(Date.parse(b.duedate));
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });
        break;
      case 'FechaCreacion':
        this.tasks.sort(function (a, b) {
          var keyA = new Date(Date.parse(a.createddate)),
            keyB = new Date(Date.parse(b.createddate));
          if (keyA < keyB) return 1;
          if (keyA > keyB) return -1;
          return 0;
        });
        break;
      case "Estado":
          let liberadastasks = [];
          this.tasks.sort(function (a, b) {
            var keyA = new Date(Date.parse(a.duedate)),
              keyB = new Date(Date.parse(b.duedate));
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
        break;
    }
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
    detail: new FormControl(''),
    duedate: new FormControl(''),
  });

  constructor(public dialogRef: MatDialogRef<AddTaskDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  CreateTask() {
    var body: any = {
      name: this.newTaskForm.get('task').value,
      detail: this.newTaskForm.get('detail').value,
      duedate: this.newTaskForm.get('duedate').value,
      createddate: new Date()
    };

    this.data.httpClient.CreateTask(body)
      .then(data => {
        Swal.fire(
          'Tarea creada',
          'Click en aceptar para continuar.',
          'success'
        ).then(res => {
          this.dialogRef.close();
        })
      });
  }

}