import api from './api';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/task.types';

export const taskService = {
  getTasksByProjectId: async (projectId: number): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
    return response.data;
  },

  getTaskById: async (projectId: number, taskId: number): Promise<Task> => {
    const response = await api.get<Task>(`/projects/${projectId}/tasks/${taskId}`);
    return response.data;
  },

  createTask: async (projectId: number, data: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  updateTask: async (projectId: number, taskId: number, data: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put<Task>(`/projects/${projectId}/tasks/${taskId}`, data);
    return response.data;
  },

  toggleTaskCompletion: async (projectId: number, taskId: number): Promise<Task> => {
    const response = await api.patch<Task>(`/projects/${projectId}/tasks/${taskId}/toggle`);
    return response.data;
  },

  deleteTask: async (projectId: number, taskId: number): Promise<void> => {
    await api.delete(`/projects/${projectId}/tasks/${taskId}`);
  },
};