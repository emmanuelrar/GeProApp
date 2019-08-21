import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  public WebApi_URL = "http://localhost:3000/"
  constructor(private httpClient: HttpClient) { }

  async GetTasks() {
    return await this.httpClient.get<any>(`${this.WebApi_URL}posts`).toPromise();
  }

  async CreateTask(task: any) {
    return await this.httpClient.post<any>(`${this.WebApi_URL}posts`, task).toPromise();
  }

  async UpdateTask(task: any) {
    return await this.httpClient.put<any>(`${this.WebApi_URL}posts`, task).toPromise();
  }
}
