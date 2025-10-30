import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Mini Project Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};