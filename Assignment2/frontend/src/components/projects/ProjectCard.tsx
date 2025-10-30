import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../types/project.types';
import { formatDate } from '../../utils/dateHelpers';
import { Button } from 'common/Botton';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: number) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const navigate = useNavigate();

  const completionPercentage =
    project.taskCount > 0 ? Math.round((project.completedTaskCount / project.taskCount) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3
            className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-primary-600"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            {project.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">{project.description || 'No description'}</p>
        </div>
        <button
          onClick={() => onDelete(project.id)}
          className="text-gray-400 hover:text-red-600 transition-colors ml-2"
          title="Delete project"
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

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tasks</span>
          <span className="font-semibold text-gray-900">
            {project.completedTaskCount} / {project.taskCount}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Created {formatDate(project.createdAt)}</span>
          <span className="text-primary-600 font-semibold">{completionPercentage}% complete</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <Button
          variant="primary"
          size="small"
          fullWidth
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};