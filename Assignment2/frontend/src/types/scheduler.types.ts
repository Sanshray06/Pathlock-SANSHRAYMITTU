export interface ScheduleRequest {
  availableHoursPerDay: number;
  startDate: string;
}

export interface ScheduledTask {
  taskId: number;
  title: string;
  scheduledDate: string;
  originalDueDate?: string;
  isOverdue: boolean;
  priority: number;
}

export interface ScheduleResponse {
  scheduledTasks: ScheduledTask[];
  totalTasks: number;
  scheduledTasksCount: number;
  startDate: string;
  estimatedCompletionDate: string;
}