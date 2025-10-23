import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../assets/MainLayout.css';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="main-layout">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      {sidebarOpen && (
        <div 
          className="sidebar-overlay active"
          onClick={closeSidebar}
        />
      )}
      
      <div className="main-content">
        <Navbar onMenuToggle={toggleSidebar} />
        
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;