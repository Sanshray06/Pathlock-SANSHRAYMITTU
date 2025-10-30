import React, { useState } from 'react';
import { Input } from 'common/Input';
import { Button } from 'common/Botton';
import { taskService } from 'services/TaskService';
import { validateTaskTitle } from '../../utils/validators';
import { showErrorToast, showSuccessToast } from '../../utils/errorHandler';

interface CreateTaskFormProps {
  projectId: number;
  onTaskCreated: () => void;
}

export const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ projectId, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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
      await taskService.createTask(projectId, {
        title: formData.title,
        dueDate: formData.dueDate || undefined,
      });
      showSuccessToast('Task created successfully!');
      setFormData({ title: '', dueDate: '' });
      setErrors({});
      onTaskCreated();
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          label="Due Date (Optional)"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
      </div>

      <Button type="submit" isLoading={isLoading} className="mt-4">
        Add Task
      </Button>
    </form>
  );
};