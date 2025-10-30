import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { CreateTaskForm } from '../components/tasks/CreateTaskForm';
import { TaskList } from '../components/tasks/TaskList';
import { SchedulerPanel } from '../components/scheduler/SchedulerPanel';
import { LoadingSpinner } from 'common/LoadingSpinner';
import { Button } from 'common/Botton';
import { projectService } from 'services/ProjectService';
import { Project } from '../types/project.types';
import { showErrorToast } from '../utils/errorHandler';

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const data = await projectService.getProjectById(parseInt(id));
      setProject(data);
    } catch (error) {
      showErrorToast(error);
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskChange = () => {
    setRefreshTrigger((prev) => prev + 1);
    loadProject(); // Reload project to update task counts
  };

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner size="large" text="Loading project..." />
      </MainLayout>
    );
  }

  if (!project) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </MainLayout>
    );
  }

  const completionPercentage =
    project.taskCount > 0 ? Math.round((project.completedTaskCount / project.taskCount) * 100) : 0;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button variant="secondary" size="small" onClick={() => navigate('/dashboard')}>
            <svg
              className="h-4 w-4 mr-1 inline"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
          {project.description && <p className="text-gray-600 mb-4">{project.description}</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="text-sm text-primary-600 font-medium mb-1">Total Tasks</div>
              <div className="text-2xl font-bold text-gray-900">{project.taskCount}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-600 font-medium mb-1">Completed</div>
              <div className="text-2xl font-bold text-gray-900">{project.completedTaskCount}</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-sm text-orange-600 font-medium mb-1">Progress</div>
              <div className="text-2xl font-bold text-gray-900">{completionPercentage}%</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <SchedulerPanel projectId={project.id} />

        <CreateTaskForm projectId={project.id} onTaskCreated={handleTaskChange} />

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tasks</h2>
          <TaskList projectId={project.id} refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </MainLayout>
  );
};