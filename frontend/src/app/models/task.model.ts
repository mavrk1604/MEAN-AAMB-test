export interface Task {
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: Date;
  tags: string[];
  history: {
    updatedAt: Date;
    changes: Map<string, any>;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
