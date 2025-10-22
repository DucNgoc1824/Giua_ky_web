const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

require('./src/config/db');

// === IMPORT ROUTES ===
const authRoutes = require('./src/routes/authRoutes');
const classRoutes = require('./src/routes/classRoutes');
const subjectRoutes = require('./src/routes/subjectRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const lecturerRoutes = require('./src/routes/lecturerRoutes');
const gradeRoutes = require('./src/routes/gradeRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// === SỬ DỤNG ROUTES ===
app.get('/', (req, res) => {
  res.json({ message: 'Chào mừng bạn đến với API Quản lý Sinh viên!' });
});

// Thêm dòng này:
// Mọi request đến /api/auth sẽ được xử lý bởi authRoutes
app.use('/api/auth', authRoutes); // <--- THÊM DÒNG NÀY
app.use('/api/classes', classRoutes); // <--- THÊM DÒNG NÀY
app.use('/api/subjects', subjectRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/lecturers', lecturerRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server đang chạy tại cổng http://localhost:${PORT}`);
});