import React, { useState, useEffect } from 'react';
import { projectService } from 'services/ProjectService';
import { Project } from '../../types/project.types';
import { ProjectCard } from './ProjectCard';
import { LoadingSpinner } from 'common/LoadingSpinner';
import { ConfirmDialog } from 'common/ConfirmDialog';
import { showErrorToast, showSuccessToast } from '../../utils/errorHandler';

interface ProjectListProps {
  onProjectCreated?: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ onProjectCreated }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; projectId: number | null }>({
    isOpen: false,
    projectId: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [onProjectCreated]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (projectId: number) => {
    setDeleteConfirm({ isOpen: true, projectId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.projectId) return;

    setIsDeleting(true);
    try {
      await projectService.deleteProject(deleteConfirm.projectId);
      showSuccessToast('Project deleted successfully');
      setProjects(projects.filter((p) => p.id !== deleteConfirm.projectId));
      setDeleteConfirm({ isOpen: false, projectId: null });
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading projects..." />;
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
          <svg
            className="h-24 w-24 mx-auto text-gray-400 mb-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Yet</h3>
          <p className="text-gray-600">Create your first project to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onDelete={handleDeleteClick} />
        ))}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, projectId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message="Are you sure you want to delete this project? All tasks will be permanently removed."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </>
  );
};