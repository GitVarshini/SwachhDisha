import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const CitizenLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

