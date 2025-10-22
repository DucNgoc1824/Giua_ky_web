import React from 'react';
import { Outlet } from 'react-router-dom'; // <-- Outlet rất quan trọng
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../assets/MainLayout.css'; // Import CSS chung

const MainLayout = () => {
  return (
    <div className="main-layout">
      {/* 1. Thanh bên */}
      <Sidebar />
      
      {/* 2. Phần nội dung chính (gồm Navbar và nội dung trang) */}
      <div className="main-content">
        {/* 2.1. Thanh trên */}
        <Navbar />
        
        {/* 2.2. Nội dung trang (Dashboard, Student, Class...) sẽ được render ở đây */}
        <main className="page-content">
          <Outlet /> {/* <-- Đây là nơi các component trang con sẽ được "bơm" vào */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;