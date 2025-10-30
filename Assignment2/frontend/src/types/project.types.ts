export interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  userId: number;
  taskCount: number;
  completedTaskCount: number;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
}

export interface UpdateProjectRequest {
  title: string;
  description?: string;
}