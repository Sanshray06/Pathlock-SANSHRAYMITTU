import React, { useState, useEffect } from 'react';
import { Modal } from 'common/Modal';
import { Input } from 'common/Input';
import { Button } from 'common/Botton';
import { Task } from '../../types/task.types';
import { taskService } from 'services/TaskService';
import { validateTaskTitle } from '../../utils/validators';
import { formatDateForInput } from '../../utils/dateHelpers';
import { showErrorToast, showSuccessToast } from '../../utils/errorHandler';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  projectId: number;
  onTaskUpdated: () => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  projectId,
  onTaskUpdated,
}) => {
  const [formData, setFormData] = useState({
    title: task.title,
    dueDate: formatDateForInput(task.dueDate),
    isCompleted: task.isCompleted,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData({
      title: task.title,
      dueDate: formatDateForInput(task.dueDate),
      isCompleted: task.isCompleted,
    });
  }, [task]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const titleError = validateTaskTitle(formData.title);
    if (titleError) newErrors.title = titleError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await taskService.updateTask(projectId, task.id, {
        title: formData.title,
        dueDate: formData.dueDate || undefined,
        isCompleted: formData.isCompleted,
      });
      showSuccessToast('Task updated successfully!');
      onTaskUpdated();
      onClose();
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task" size="medium">
      <form onSubmit={handleSubmit}>
        <Input
          label="Task Title"
          placeholder="Enter task title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          required
        />

        <Input
          type="date"
          label="Due Date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />

        <div className="mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isCompleted}
              onChange={(e) => setFormData({ ...formData, isCompleted: e.target.checked })}
              className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Mark as completed</span>
          </label>
        </div>

        <div className="flex space-x-3 justify-end mt-6">
          <Button variant="secondary" onClick={onClose} type="button" disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            Update Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};