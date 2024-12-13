import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';


@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  statuses = ['Pending', 'In Progress', 'Completed'];
  priorities = ['Low', 'Medium', 'High'];

  searchTerm = '';
  selectedStatus = '';
  selectedPriority = '';
  tagFilter = '';

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      (data: Task[]) => {
        console.log('Fetched tasks:', data);
        this.tasks = data;
        this.filteredTasks = [...this.tasks];
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
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
}
