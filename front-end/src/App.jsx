import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import MainLayout from './layouts/MainLayout';
import ClassManagementPage from './pages/ClassManagementPage';
import SubjectManagementPage from './pages/SubjectManagementPage';
import StudentManagementPage from './pages/StudentManagementPage';
import LecturerManagementPage from './pages/LecturerManagementPage';
import MyGradesPage from './pages/MyGradesPage';
import ManageGradesPage from './pages/ManageGradesPage';
import ViewGradesPage from './pages/ViewGradesPage';
import DashboardPage from './pages/DashboardPage';
import CourseMaterialPage from './pages/CourseMaterialPage';
import TicketInboxPage from './pages/TicketInboxPage';

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* 1. Route Đăng nhập (Công khai) */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        }
      />
      <Route
        path="/"
        element={
          isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
        }
      >
        {/* === ROUTE CHUNG === */}
        <Route index={true} element={<DashboardPage />} /> 

        {/* === ROUTES CỦA ADMIN (roleId === 1) === */}
        {/* Chúng ta cũng nên bảo vệ các route này ở frontend */}
        {user?.roleId === 1 && (
          <>
            <Route path="students" element={<StudentManagementPage />} />
            <Route path="lecturers" element={<LecturerManagementPage />} /> 
            <Route path="classes" element={<ClassManagementPage />} />
            <Route path="subjects" element={<SubjectManagementPage />} />
            <Route path="materials" element={<CourseMaterialPage />} />
          </>
        )}

        {/* === ROUTES CỦA GIẢNG VIÊN (roleId === 2) === */}
        {user?.roleId === 2 && (
          <>
            <Route path="manage-grades" element={<ManageGradesPage />} />
            <Route path="view-grades" element={<ViewGradesPage />} />
            <Route path="materials" element={<CourseMaterialPage />} />
            <Route path="tickets-inbox" element={<TicketInboxPage />} />
          </>
        )}
        
        {/* === ROUTES CỦA SINH VIÊN (roleId === 3) === */}
        {user?.roleId === 3 && (
          <Route path="my-grades" element={<MyGradesPage />} />
        )}
        
      </Route>  
      {/* 3. (Tùy chọn) Route 404 (Không tìm thấy) */}
      <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />

    </Routes>
  );
}

export default App;