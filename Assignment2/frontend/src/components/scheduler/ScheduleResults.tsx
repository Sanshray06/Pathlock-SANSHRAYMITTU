import React from 'react';
import { ScheduleResponse } from '../../types/scheduler.types';
import { formatDate } from '../../utils/dateHelpers';

interface ScheduleResultsProps {
  schedule: ScheduleResponse;
}

export const ScheduleResults: React.FC<ScheduleResultsProps> = ({ schedule }) => {
  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return { label: 'High', color: 'bg-red-100 text-red-800' };
      case 2:
        return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
      case 3:
        return { label: 'Low', color: 'bg-green-100 text-green-800' };
      default:
        return { label: 'Normal', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Group tasks by scheduled date
  const tasksByDate = schedule.scheduledTasks.reduce((acc, task) => {
    const date = formatDate(task.scheduledDate);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, typeof schedule.scheduledTasks>);

  return (
    <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-gray-900">Scheduled Tasks</h4>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{schedule.scheduledTasksCount}</span> of{' '}
          <span className="font-medium">{schedule.totalTasks}</span> tasks scheduled
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Start Date</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatDate(schedule.startDate)}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Estimated Completion</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatDate(schedule.estimatedCompletionDate)}
          </div>
        </div>
      </div>

      {schedule.scheduledTasksCount === 0 ? (
        <div className="text-center py-8 text-gray-500">
          All tasks are already completed! 🎉
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(tasksByDate).map(([date, tasks]) => (
            <div key={date} className="border-l-4 border-primary-500 pl-4">
              <h5 className="text-md font-semibold text-gray-900 mb-3">{date}</h5>
              <div className="space-y-2">
                {tasks.map((task) => {
                  const priority = getPriorityLabel(task.priority);
                  return (
                    <div
                      key={task.taskId}
                      className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{task.title}</span>
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded ${priority.color}`}
                            >
                              {priority.label}
                            </span>
                            {task.isOverdue && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-800">
                                Overdue
                              </span>
                            )}
                          </div>
                          {task.originalDueDate && (
                            <div className="text-sm text-gray-600">
                              Original due date: {formatDate(task.originalDueDate)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};