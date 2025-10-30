export interface Task {
  id: number;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  createdAt: string;
  projectId: number;
}

export interface CreateTaskRequest {
  title: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title: string;
  dueDate?: string;
  isCompleted: boolean;
}