import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api';
  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/get-tasks`); // Calls /api/get-tasks
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/get-task-by-id/${id}`); // Calls /api/get-task-by-id/:id
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/create-task`, task); // Calls /api/create-task
  }

  updateTask(id: string, task: Partial<Task>): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-task/${id}`, task);  // Added apiUrl
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-task/${id}`); // Calls /api/delete-task/:id
  }

}
