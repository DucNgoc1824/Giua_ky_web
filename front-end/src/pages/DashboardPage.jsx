import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaSchool, 
  FaBook,
  FaChartLine,
  FaClipboardCheck,
  FaCalendarAlt,
  FaTrophy
} from 'react-icons/fa';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
} from 'chart.js';
import dashboardService from '../services/dashboardService';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import ActivityTimeline from '../components/ActivityTimeline';
import QuickActions from '../components/QuickActions';
import '../assets/DashboardPage.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getAdminStats();
        setStats(data);
      } catch {
        toast.error('Không thể tải thống kê');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <LoadingSpinner message="Đang tải thống kê..." />;
  if (!stats) return <div>Không có dữ liệu</div>;

  // Chart data for Bar chart - System overview
  const barChartData = {
    labels: ['Sinh viên', 'Giảng viên', 'Lớp học', 'Môn học'],
    datasets: [
      {
        label: 'Thống kê',
        data: [stats.students, stats.lecturers, stats.classes, stats.subjects],
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(118, 75, 162, 0.8)',
          'rgba(255, 152, 0, 0.8)',
          'rgba(156, 39, 176, 0.8)',
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(118, 75, 162, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(156, 39, 176, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Tổng quan hệ thống',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: 20,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Doughnut chart data - REAL Grade Distribution
  const gradeLabels = stats.gradeDistribution?.map(g => g.letter_grade) || [];
  const gradeCounts = stats.gradeDistribution?.map(g => g.count) || [];
  
  const gradeColors = {
    'A+': 'rgba(76, 175, 80, 0.8)',   // Green
    'A': 'rgba(139, 195, 74, 0.8)',   // Light Green
    'B+': 'rgba(33, 150, 243, 0.8)',  // Blue
    'B': 'rgba(3, 169, 244, 0.8)',    // Light Blue
    'C+': 'rgba(255, 193, 7, 0.8)',   // Amber
    'C': 'rgba(255, 152, 0, 0.8)',    // Orange
    'D+': 'rgba(255, 87, 34, 0.8)',   // Deep Orange
    'D': 'rgba(244, 67, 54, 0.8)',    // Red
    'F': 'rgba(156, 39, 176, 0.8)',   // Purple
  };

  const doughnutData = {
    labels: gradeLabels,
    datasets: [
      {
        data: gradeCounts,
        backgroundColor: gradeLabels.map(grade => gradeColors[grade]),
        borderColor: '#ffffff',
        borderWidth: 3,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: `Phân bố điểm (GPA TB: ${stats.avgGPA || 0})`,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: 20,
      },
    },
  };

  // Sample activities for Admin
  const sampleActivities = [
    {
      type: 'create',
      text: 'Đã thêm 5 sinh viên mới vào hệ thống',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
    },
    {
      type: 'edit',
      text: 'Cập nhật thông tin giảng viên Nguyễn Văn A',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    },
    {
      type: 'upload',
      text: 'Thêm môn học mới: Lập trình Web',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      type: 'grade',
      text: 'Đã nhập điểm cho lớp D22CQPT01',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="stats-grid">
        <StatCard icon={FaUsers} count={stats.students} label="Sinh viên" color="#667eea" />
        <StatCard icon={FaChalkboardTeacher} count={stats.lecturers} label="Giảng viên" color="#764ba2" />
        <StatCard icon={FaSchool} count={stats.classes} label="Lớp học" color="#FF9800" />
        <StatCard icon={FaBook} count={stats.subjects} label="Môn học" color="#9C27B0" />
      </div>

      <QuickActions role={1} />

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-container" style={{ height: '350px' }}>
            <Bar data={barChartData} options={barOptions} />
          </div>
        </div>
      </div>

      <ActivityTimeline activities={sampleActivities} />
    </div>
  );
};

// ==================== LECTURER DASHBOARD ====================
const LecturerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getLecturerStats();
        setStats(data);
      } catch (error) {
        toast.error('Không thể tải thống kê');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <LoadingSpinner message="Đang tải thống kê..." />;
  if (!stats) return <div>Không có dữ liệu</div>;

  const lecturerActivities = [
    {
      type: 'grade',
      text: `Đã nhập ${stats.totalGrades} điểm cho sinh viên`,
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      type: 'upload',
      text: 'Upload tài liệu mới: Bài giảng Chapter 5',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      type: 'assignment',
      text: 'Tạo bài tập mới cho môn học',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
    {
      type: 'edit',
      text: 'Cập nhật thông tin lớp học',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    },
  ];

  // REAL Grade distribution from database
  const gradeLabels = stats.gradeDistribution?.map(g => g.letter_grade) || [];
  const gradeCounts = stats.gradeDistribution?.map(g => g.count) || [];
  
  const gradeColors = {
    'A+': 'rgba(76, 175, 80, 0.8)',
    'A': 'rgba(139, 195, 74, 0.8)',
    'B+': 'rgba(33, 150, 243, 0.8)',
    'B': 'rgba(3, 169, 244, 0.8)',
    'C+': 'rgba(255, 193, 7, 0.8)',
    'C': 'rgba(255, 152, 0, 0.8)',
    'D+': 'rgba(255, 87, 34, 0.8)',
    'D': 'rgba(244, 67, 54, 0.8)',
    'F': 'rgba(156, 39, 176, 0.8)',
  };

  const gradeDistributionData = {
    labels: gradeLabels,
    datasets: [
      {
        label: 'Số bản ghi',
        data: gradeCounts,
        backgroundColor: gradeLabels.map(grade => gradeColors[grade]),
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const gradeBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Phân bố điểm lớp học',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: 20,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="lecturer-dashboard">
      <div className="stats-grid">
        <StatCard icon={FaUsers} count={stats.students || 0} label="Tổng sinh viên" color="#667eea" />
        <StatCard icon={FaSchool} count={stats.classes || 0} label="Lớp giảng dạy" color="#764ba2" />
        <StatCard icon={FaClipboardCheck} count={stats.totalGrades || 0} label="Điểm đã nhập" color="#f59e0b" />
        <StatCard icon={FaBook} count={stats.totalGrades || 0} label="Bài đã chấm" color="#10b981" />
      </div>

      <QuickActions role={2} />

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-container" style={{ height: '350px' }}>
            <Bar data={gradeDistributionData} options={gradeBarOptions} />
          </div>
        </div>
      </div>

      <ActivityTimeline activities={lecturerActivities} />
    </div>
  );
};

// ==================== STUDENT DASHBOARD ====================
const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStudentStats();
        setStats(data);
      } catch {
        toast.error('Không thể tải thống kê');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <LoadingSpinner message="Đang tải thống kê..." />;
  if (!stats) return <div>Không có dữ liệu</div>;

  const studentActivities = [
    {
      type: 'grade',
      text: `GPA hiện tại: ${stats.gpa || 0}`,
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
    },
    {
      type: 'upload',
      text: 'Xem điểm các môn học',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      type: 'assignment',
      text: `Đã có điểm ${stats.subjects} môn học`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
    {
      type: 'edit',
      text: 'Cập nhật thông tin cá nhân',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ];

  // REAL GPA trend from database
  const gpaTrendLabels = stats.gradeTrend?.map(t => t.semester) || ['2024-1'];
  const gpaTrendData = stats.gradeTrend?.map(t => t.avg_gpa) || [stats.gpa || 0];

  const gpaData = {
    labels: gpaTrendLabels,
    datasets: [
      {
        label: 'GPA',
        data: gpaTrendData,
        borderColor: 'rgba(102, 126, 234, 1)',
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(102, 126, 234, 1)',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const gpaOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Xu hướng GPA theo học kỳ',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: 20,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
        max: 4,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  // REAL Subject grades radar chart
  const subjectLabels = stats.gradesBySubject?.map(g => g.subject_code) || [];
  const subjectScores = stats.gradesBySubject?.map(g => g.total_score) || [];

  const subjectGradesData = {
    labels: subjectLabels,
    datasets: [
      {
        label: 'Điểm',
        data: subjectScores,
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(102, 126, 234, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(102, 126, 234, 1)',
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Điểm các môn học',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: 20,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="student-dashboard">
      <div className="stats-grid">
        <StatCard icon={FaChartLine} count={(stats.gpa || 0).toFixed(2)} label="GPA" color="#667eea" />
        <StatCard icon={FaBook} count={stats.subjects || 0} label="Môn học" color="#764ba2" />
        <StatCard icon={FaClipboardCheck} count={stats.totalGrades || 0} label="Điểm đã có" color="#10b981" />
        <StatCard icon={FaCalendarAlt} count={`${stats.avgAttendance || 0}%`} label="Điểm danh TB" color="#f59e0b" />
      </div>

      <QuickActions role={3} />

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-container" style={{ height: '350px' }}>
            <Line data={gpaData} options={gpaOptions} />
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-container" style={{ height: '350px' }}>
            <Radar data={subjectGradesData} options={radarOptions} />
          </div>
        </div>
      </div>

      <ActivityTimeline activities={studentActivities} />
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <h2>Xin chào, {user.fullName}!</h2>
      {user.roleId === 1 && <AdminDashboard />}
      {user.roleId === 2 && <LecturerDashboard />}
      {user.roleId === 3 && <StudentDashboard />}
    </div>
  );
};

export default DashboardPage;
