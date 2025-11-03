const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

require('./src/config/db');

const authRoutes = require('./src/routes/authRoutes');
const classRoutes = require('./src/routes/classRoutes');
const subjectRoutes = require('./src/routes/subjectRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const lecturerRoutes = require('./src/routes/lecturerRoutes');
const gradeRoutes = require('./src/routes/gradeRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const courseMaterialRoutes = require('./src/routes/courseMaterialRoutes');
const assignmentRoutes = require('./src/routes/assignmentRoutesNew');
const ticketRoutes = require('./src/routes/ticketRoutes');
const chatbotRoutes = require('./src/routes/chatbotRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration - Allow both web and Android
const corsOptions = {
  origin: [
    'http://localhost:5173',           // Web frontend
    'http://10.0.2.2:8080',            // Android emulator
    'http://localhost:8080',           // For testing
    /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d+$/ // Android device on same network
  ],
  credentials: true
};

app.use(cors(corsOptions)); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Chào mừng bạn đến với API Quản lý Sinh viên!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/lecturers', lecturerRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/materials', courseMaterialRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/uploads', express.static('uploads'));

// Listen on all network interfaces (0.0.0.0) to allow Android emulator connection
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Android emulator can access at http://10.0.2.2:${PORT}`);
});