import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProjectList } from '../components/projects/ProjectList';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { Button } from 'common/Botton';

export const DashboardPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProjectCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-600 mt-1">Manage all your projects in one place</p>
          </div>
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            <svg
              className="h-5 w-5 mr-2 inline"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Button>
        </div>

        <ProjectList onProjectCreated={() => console.log('project created')} />


        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onProjectCreated={handleProjectCreated}
        />
      </div>
    </MainLayout>
  );
};