import React, { useState } from 'react';
import { Input } from 'common/Input';
import { Button } from 'common/Botton';
import { schedulerService } from 'services/schedulerService';
import { ScheduleResponse } from '../../types/scheduler.types';
import { ScheduleResults } from './ScheduleResults';
import { showErrorToast, showSuccessToast } from '../../utils/errorHandler';

interface SchedulerPanelProps {
  projectId: number;
}

export const SchedulerPanel: React.FC<SchedulerPanelProps> = ({ projectId }) => {
  const [formData, setFormData] = useState({
    availableHoursPerDay: 6,
    startDate: new Date().toISOString().split('T')[0],
  });
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const result = await schedulerService.generateSchedule(projectId, {
        availableHoursPerDay: formData.availableHoursPerDay,
        startDate: new Date(formData.startDate).toISOString(),
      });
      setSchedule(result);
      showSuccessToast('Schedule generated successfully!');
      setIsExpanded(true);
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <svg
            className="h-6 w-6 text-primary-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900">Smart Task Scheduler</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <div className="animate-slide-down">
          <p className="text-gray-700 mb-6">
            Let our AI-powered scheduler organize your tasks based on priorities and due dates!
          </p>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Available Hours Per Day"
                min="1"
                max="24"
                value={formData.availableHoursPerDay}
                onChange={(e) =>
                  setFormData({ ...formData, availableHoursPerDay: parseInt(e.target.value) })
                }
                helperText="How many hours can you dedicate each day?"
                required
              />

              <Input
                type="date"
                label="Start Date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                helperText="When do you want to start?"
                required
              />
            </div>

            <Button type="submit" isLoading={isLoading} className="mt-4">
              <svg
                className="h-5 w-5 mr-2 inline"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Schedule
            </Button>
          </form>

          {schedule && <ScheduleResults schedule={schedule} />}
        </div>
      )}
    </div>
  );
};