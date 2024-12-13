import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  @Input() taskId: string | null = null; // For editing an existing task
  taskToEdit: Task | null = null;
  existingTags: Set<string> = new Set(); // To enforce unique tags

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      dueDate: ['', [Validators.required, this.dateValidator]],
      status: ['Pending', Validators.required],
      priority: ['Low', Validators.required],
      tags: ['']
    });
  }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      dueDate: ['', [Validators.required, this.dateValidator]],
      status: ['Pending', Validators.required],
      priority: ['Low', Validators.required],
      tags: ['']
    });

    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('id');
      if (this.taskId) {
        this.loadTaskForEditing(this.taskId);
      }
    });
  }

  loadTaskForEditing(id: string): void {
    this.taskService.getTaskById(id).subscribe(task => {
      this.taskToEdit = task;
      this.taskForm.patchValue({
        title: task.title,
        dueDate: task.dueDate,
        status: task.status,
        priority: task.priority
      });
      this.existingTags = new Set(task.tags);
    });
  }

  dateValidator(control: any): { [key: string]: boolean } | null {
    const today = new Date();
    const dueDate = new Date(control.value);
    if (dueDate < today) {
      return { 'pastDate': true };
    }
    return null;
  }

  get tagsArray(): string[] {
    return Array.from(this.existingTags);
  }

  addTag(tag: string): void {
    if (tag && !this.existingTags.has(tag)) {
      this.existingTags.add(tag);
      this.taskForm.patchValue({ tags: Array.from(this.existingTags).join(', ') });
    }
  }

  removeTag(tag: string): void {
    this.existingTags.delete(tag);
    this.taskForm.patchValue({ tags: Array.from(this.existingTags).join(', ') });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const taskData: Task = {
      ...this.taskForm.value,
      tags: Array.from(this.existingTags),
    };

    if (this.taskToEdit && this.taskToEdit._id) {
      this.taskService.updateTask(this.taskToEdit._id, taskData).subscribe();
    } else {
      this.taskService.createTask(taskData).subscribe();
    }
  }
}
