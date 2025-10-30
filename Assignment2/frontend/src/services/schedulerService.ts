import api from './api';
import { ScheduleRequest, ScheduleResponse } from '../types/scheduler.types';

export const schedulerService = {
  generateSchedule: async (projectId: number, data: ScheduleRequest): Promise<ScheduleResponse> => {
    const response = await api.post<ScheduleResponse>(`/projects/${projectId}/schedule`, data);
    return response.data;
  },
};