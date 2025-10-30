import React, { useState, useEffect } from 'react';
import { taskService } from 'services/TaskService';
import { Task } from '../../types/task.types';
import { TaskItem } from './TaskItem';
import { EditTaskModal } from './EditTaskModal';
import { LoadingSpinner } from 'common/LoadingSpinner';
import { ConfirmDialog } from 'common/ConfirmDialog';
import { showErrorToast, showSuccessToast } from '../../utils/errorHandler';

interface TaskListProps {
  projectId: number;
  refreshTrigger?: number;
}

export const TaskList: React.FC<TaskListProps> = ({ projectId, refreshTrigger }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; taskId: number | null }>({
    isOpen: false,
    taskId: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [projectId, refreshTrigger]);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const data = await taskService.getTasksByProjectId(projectId);
      setTasks(data);
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (taskId: number) => {
    try {
      const updatedTask = await taskService.toggleTaskCompletion(projectId, taskId);
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
      showSuccessToast('Task status updated');
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleTaskUpdated = () => {
    loadTasks();
  };

  const handleDeleteClick = (taskId: number) => {
    setDeleteConfirm({ isOpen: true, taskId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.taskId) return;

    setIsDeleting(true);
    try {
      await taskService.deleteTask(projectId, deleteConfirm.taskId);
      showSuccessToast('Task deleted successfully');
      setTasks(tasks.filter((t) => t.id !== deleteConfirm.taskId));
      setDeleteConfirm({ isOpen: false, taskId: null });
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading tasks..." />;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-50 rounded-lg p-8">
          <svg
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Yet</h3>
          <p className="text-gray-600">Add your first task to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      {editingTask && (
        <EditTaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          task={editingTask}
          projectId={projectId}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, taskId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </>
  );
};