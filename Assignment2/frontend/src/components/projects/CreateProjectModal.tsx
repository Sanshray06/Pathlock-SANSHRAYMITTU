import React, { useState } from 'react';
import { Modal } from 'common/Modal';
import { Input } from 'common/Input';
import { Textarea } from 'common/Textarea';
import { Button } from 'common/Botton';
import { projectService } from 'services/ProjectService';
import { validateProjectTitle, validateProjectDescription } from '../../utils/validators';
import { showErrorToast, showSuccessToast } from '../../utils/errorHandler';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const titleError = validateProjectTitle(formData.title);
    if (titleError) newErrors.title = titleError;

    if (formData.description) {
      const descError = validateProjectDescription(formData.description);
      if (descError) newErrors.description = descError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await projectService.createProject({
        title: formData.title,
        description: formData.description || undefined,
      });
      showSuccessToast('Project created successfully!');
      setFormData({ title: '', description: '' });
      setErrors({});
      onProjectCreated();
      onClose();
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Project" size="medium">
      <form onSubmit={handleSubmit}>
        <Input
          label="Project Title"
          placeholder="Enter project title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          required
        />

        <Textarea
          label="Description"
          placeholder="Enter project description (optional)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          error={errors.description}
          helperText={`${formData.description.length}/500 characters`}
        />

        <div className="flex space-x-3 justify-end mt-6">
          <Button variant="secondary" onClick={handleClose} type="button" disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};