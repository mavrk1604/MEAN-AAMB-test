import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  @ViewChild('editTaskModal') editTaskModal!: ElementRef;

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  statuses = ['Pending', 'In Progress', 'Completed'];
  priorities = ['Low', 'Medium', 'High'];
  searchTerm = '';
  selectedStatus = '';
  selectedPriority = '';
  tagFilter = '';
  editTaskForm: FormGroup;
  currentTaskId: string = '';
  private bootstrapModal: any;

  constructor(private taskService: TaskService, private fb: FormBuilder) {
    this.editTaskForm = this.fb.group({
      title: [''],
      description: [''],
      dueDate: [''],
      status: [''],
      priority: [''],
      tags: ['']
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data: Task[]) => {
        console.log('Fetched tasks:', data);
        this.tasks = data;
        this.filteredTasks = [...this.tasks];
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      }
    });
  }

  filterTasks(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus ? task.status === this.selectedStatus : true;
      const matchesPriority = this.selectedPriority ? task.priority === this.selectedPriority : true;
      const tags = this.tagFilter
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag !== '');
      const matchesTags = tags.length
        ? tags.every(tag => task.tags.map(t => t.toLowerCase()).includes(tag))
        : true;
      return matchesSearch && matchesStatus && matchesPriority && matchesTags;
    });
  }

  openEditModal(task: Task): void {
    this.currentTaskId = task._id || '';
    this.editTaskForm.patchValue({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
      tags: task.tags.join(', ')
    });

    this.bootstrapModal = new Modal(this.editTaskModal.nativeElement);
    this.bootstrapModal.show();
  }

  confirmEdit(): void {
    const updatedTask = this.editTaskForm.value;
    updatedTask.tags = updatedTask.tags.split(',').map((tag: string) => tag.trim());

    this.taskService.updateTask(this.currentTaskId, updatedTask)
      .pipe(
        catchError(error => {
          console.error('Error updating task:', error);
          return throwError(() => new Error('Failed to update task'));
        })
      )
      .subscribe({
        next: () => {
          this.loadTasks();
          this.bootstrapModal.hide();
        },
        error: (error) => {
          console.error('Error in task update subscription:', error);
        }
      });
  }


  deleteTask(id: string): void {
    const confirmation = window.confirm('Are you sure you want to delete this task?');

    if (confirmation) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          alert('Task has been deleted successfully!');
          this.loadTasks();
        },
        error: (error: any) => console.error('Error deleting task:', error)
      });
    }
  }
}