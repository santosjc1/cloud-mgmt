import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from './Sidebar';
import { SidebarProvider } from '../contexts/SidebarContext';
import { useSidebar } from '../contexts/SidebarContext';

function Layout() {
  const { isOpen } = useSidebar();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <main className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <Layout />
    </SidebarProvider>
  );
}