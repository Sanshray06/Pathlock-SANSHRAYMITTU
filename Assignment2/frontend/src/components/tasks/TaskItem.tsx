import React from 'react';
import { Task } from '../../types/task.types';
import { formatDate, isOverdue, isDueSoon } from '../../utils/dateHelpers';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const getStatusColor = () => {
    if (task.isCompleted) return 'text-green-600';
    if (task.dueDate && isOverdue(task.dueDate)) return 'text-red-600';
    if (task.dueDate && isDueSoon(task.dueDate)) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getStatusText = () => {
    if (task.isCompleted) return 'Completed';
    if (task.dueDate && isOverdue(task.dueDate)) return 'Overdue';
    if (task.dueDate && isDueSoon(task.dueDate)) return 'Due Soon';
    return 'Pending';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200">
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggle(task.id)}
          className="mt-1 h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4
              className={`text-lg font-medium ${
                task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {task.title}
            </h4>

            <div className="flex items-center space-x-2 ml-2">
              <button
                onClick={() => onEdit(task)}
                className="text-gray-400 hover:text-primary-600 transition-colors"
                title="Edit task"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              <button
                onClick={() => onDelete(task.id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Delete task"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center space-x-4 text-sm">
            <span className={`font-medium ${getStatusColor()}`}>{getStatusText()}</span>
            {task.dueDate && (
              <span className="text-gray-500">Due: {formatDate(task.dueDate)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};