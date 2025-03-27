export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
}

export type TaskFilter = 'all' | 'completed' | 'pending';

export interface Quote {
  id: number;
  quote: string;
  author: string;
}
