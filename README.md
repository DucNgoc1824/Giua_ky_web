# 🎓 Hệ Thống Quản Lý Sinh Viên PTIT

> Ứng dụng web full-stack quản lý sinh viên với React, Node.js, MySQL và AI Chatbot 🤖

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Tính năng chính

### 🎯 Quản lý & Thống kê

-   🔐 **Đăng nhập phân quyền** - Admin, Giảng viên, Sinh viên với JWT authentication
-   📊 **Dashboard thống kê** - Biểu đồ trực quan, phân tích dữ liệu theo thời gian thực
-   👥 **Quản lý người dùng** - CRUD đầy đủ cho sinh viên, giảng viên
-   � **Quản lý lớp học & môn học** - Tổ chức lớp, phân công giảng viên

### 📝 Học tập & Đánh giá

-   📝 **Quản lý điểm** - Hệ thống tính điểm tự động (CC 10%, TH 20%, GK 20%, CK 50%)
-   � **Bài tập trực tuyến** - Giao bài, nộp bài, chấm điểm online
-   📚 **Tài liệu học tập** - Upload/Download tài liệu theo môn học
-   💬 **Hệ thống hỏi đáp** - Gửi thắc mắc, nhận phản hồi từ giảng viên

### 🤖 AI & Tự động hóa

-   🤖 **AI Chatbot (Google Gemini)** - Trợ lý ảo trả lời thắc mắc tự động
-   🔍 **RAG System** - Tìm kiếm thông tin từ lịch sử tickets, bài tập, tài liệu
-   📊 **Confidence Scoring** - Tự động đề xuất tạo ticket khi AI không chắc chắn
-   � **Chat History** - Lưu trữ lịch sử hội thoại với AI

### 🎨 Trải nghiệm người dùng

-   🌙 **Dark Mode** - Chế độ tối bảo vệ mắt
-   📱 **Responsive Design** - Hoạt động mượt mà trên mọi thiết bị
-   🔑 **Quên mật khẩu** - Xác thực OTP qua email
-   ⚡ **Real-time Updates** - Cập nhật dữ liệu theo thời gian thực

## 🛠️ Công nghệ sử dụng

### Backend

-   **Node.js** v16+ - JavaScript runtime
-   **Express.js** v5 - Web framework
-   **MySQL** v8.0 - Relational database
-   **JWT** - Xác thực & phân quyền
-   **bcryptjs** - Mã hóa mật khẩu
-   **Multer** - Upload files
-   **Google Gemini AI** - AI chatbot engine
-   **@google/generative-ai** - Gemini API client

### Frontend

-   **React** v18.3 - UI library
-   **Vite** - Build tool & dev server
-   **React Router** v6 - Client-side routing
-   **Axios** - HTTP client
-   **React Toastify** - Notifications
-   **React Icons** - Icon library
-   **React Select** - Custom dropdown component
-   **Recharts** - Data visualization

## � Yêu cầu hệ thống

-   **Node.js** >= 16.x ([Download](https://nodejs.org/))
-   **MySQL** >= 8.0 ([Download](https://dev.mysql.com/downloads/mysql/))
-   **npm** hoặc **yarn**
-   **Git** ([Download](https://git-scm.com/))
-   **Google Gemini API Key** (Miễn phí tại [Google AI Studio](https://aistudio.google.com/app/apikey))

## 🚀 Hướng dẫn cài đặt

### Bước 1: Clone repository

```bash
git clone https://github.com/DucNgoc1824/Giua_ky_web.git

cd Giua_ky_web
```

### Bước 2: Cài đặt Backend

```bash
cd back-end
npm install
```

Tạo file `.env` trong thư mục `back-end/`:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=qlsv

# JWT Secret (tối thiểu 32 ký tự)
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# Server Port
PORT=8080

# Google Gemini AI API Key (Lấy miễn phí tại: https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Bước 3: Tạo Database

Mở MySQL và chạy:

```sql
CREATE DATABASE qlsv CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Bước 4: Import dữ liệu

**Trên Windows (PowerShell):**

```powershell
# Import schema
Get-Content database\schema.sql | mysql -u root -p qlsv

# Import dữ liệu mẫu (80 sinh viên)
Get-Content database\sample_grades_80.sql | mysql -u root -p qlsv

# Tạo bảng Chatbot_Logs (cho AI chatbot)
Get-Content database\create_chatbot_logs.sql | mysql -u root -p qlsv
```

**Trên Linux/Mac:**

```bash
# Import schema
mysql -u root -p qlsv < database/schema.sql

# Import dữ liệu mẫu
mysql -u root -p qlsv < database/sample_grades_80.sql

# Tạo bảng Chatbot_Logs
mysql -u root -p qlsv < database/create_chatbot_logs.sql

```

### 4. Cài đặt Frontend**Trên Linux/Mac:**

````bash

```bashmysql -u root -p qlsv < database/schema.sql

cd ../front-endmysql -u root -p qlsv < database/sample_grades_80.sql

npm install```

````

````

### Bước 5: Cài đặt Frontend

Mở terminal mới:

```bash
cd front-end
npm install
````

### Bước 6: Lấy Google Gemini API Key (Miễn phí)

1. Truy cập: https://aistudio.google.com/app/apikey
2. Đăng nhập bằng tài khoản Google
3. Click **"Create API Key"**
4. Copy API key và paste vào file `.env` ở Backend (biến `GEMINI_API_KEY`)

> 💡 **Lưu ý:** API key miễn phí với 60 requests/phút, đủ cho mục đích học tập!

### Bước 7: Chạy ứng dụng

**Terminal 1 - Backend:**

```bash
cd back-end
npm start
```

✅ Backend chạy tại: `http://localhost:8080`

**Terminal 2 - Frontend:**

```bash
cd front-end
npm run dev
```

✅ Frontend chạy tại: `http://localhost:5173`

### Bước 8: Đăng nhập

Mở trình duyệt và truy cập: `http://localhost:5173`

## 👤 Tài khoản demo

| Role          | Username          | Password   | Mô tả                                   |
| ------------- | ----------------- | ---------- | --------------------------------------- |
| 👨‍💼 Admin      | `admin`           | `password` | Quản trị viên - Full quyền              |
| 👨‍🏫 Giảng viên | `gv001` - `gv003` | `password` | Quản lý lớp, chấm điểm, phản hồi        |
| 👨‍🎓 Sinh viên  | `sv001` - `sv080` | `password` | Xem điểm, nộp bài, hỏi đáp, **chat AI** |

**Ví dụ đăng nhập:**

-   Admin: `admin` / `password`
-   Giảng viên: `gv001` / `password`
-   Sinh viên: `sv001` / `password` ⭐ (Có AI Chatbot)

## 🤖 Hướng dẫn sử dụng AI Chatbot

### Dành cho Sinh viên:

1. Đăng nhập bằng tài khoản sinh viên (`sv001` - `sv080`)
2. Vào menu **"Hỏi đáp/Góp ý"**
3. Click vào nút **🤖 Chatbot** màu tím ở góc dưới phải
4. Chọn môn học từ dropdown
5. Gõ câu hỏi và nhận câu trả lời từ AI

### Các câu hỏi ví dụ:

```
- "Deadline nộp bài tập của môn Lập trình game cơ bản là khi nào?"
- "Hướng dẫn cách làm bài tập về game"
- "Tài liệu học tập môn này ở đâu?"
- "Cách tính điểm môn học này như thế nào?"
```

### Tính năng:

-   ✅ Trả lời dựa trên lịch sử tickets, bài tập, tài liệu
-   ✅ Tự động đề xuất "Gửi ticket" nếu AI không chắc chắn
-   ✅ Lưu lịch sử chat
-   ✅ Có thể search môn học
-   ✅ Responsive trên mobile

## 📁 Cấu trúc dự án

````bash
Giua_ky_web/
├── back-end/
│   ├── database/
│   │   ├── schema.sql                    # Database schema
│   │   ├── sample_grades_80.sql          # Dữ liệu mẫu 80 sinh viên
│   │   └── create_chatbot_logs.sql       # Bảng lưu chat history
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                     # Kết nối MySQL
│   │   ├── controllers/
│   │   │   ├── authController.js         # Login, forgot password
│   │   │   ├── chatbotController.js      # 🤖 AI Chatbot logic
│   │   │   ├── gradeController.js        # Quản lý điểm
│   │   │   ├── assignmentController.js   # Quản lý bài tập
│   │   │   └── ...
│   │   ├── models/                       # Database queries
│   │   ├── routes/
│   │   │   ├── chatbotRoutes.js          # 🤖 API chatbot
│   │   │   ├── authRoutes.js             # API auth
│   │   │   └── ...
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js         # JWT verification
│   │   │   └── uploadMiddleware.js       # File upload
│   │   └── utils/
│   │       └── otpStore.js               # OTP management
│   ├── uploads/                          # Thư mục lưu files
│   ├── .env                              # ⚠️ Environment variables (KHÔNG push lên Git)
│   ├── package.json
│   └── server.js                         # Entry point
│
└── front-end/
    ├── src/
    │   ├── components/
    │   │   ├── ChatWidget.jsx            # 🤖 AI Chatbot UI
    │   │   ├── Navbar.jsx                # Navigation bar
    │   │   ├── Sidebar.jsx               # Sidebar menu
    │   │   └── ...
    │   ├── pages/
    │   │   ├── LoginPage.jsx             # Trang đăng nhập
    │   │   ├── DashboardPage.jsx         # Dashboard thống kê
    │   │   ├── TicketInboxPage.jsx       # Hỏi đáp (có Chatbot)
    │   │   └── ...
    │   ├── services/
    │   │   ├── api.js                    # Axios config
    │   │   ├── chatbotService.js         # 🤖 Chatbot API calls
    │   │   └── ...
    │   ├── context/
    │   │   ├── AuthContext.jsx           # Authentication state
    │   │   └── ThemeContext.jsx          # Dark mode state
    │   ├── assets/
    │   │   ├── ChatWidget.css            # 🤖 Chatbot styles
    │   │   └── ...
    │   ├── App.jsx                       # Root component
    │   └── main.jsx                      # Entry point
    ├── package.json
    └── vite.config.js                    # Vite configuration

    └── App.jsx```

````

## 👤 Tài khoản mẫu

## 🗄️ Database Schema

### Bảng chính (12 tables):

1. **Users** - Tài khoản người dùng
2. **Roles** - Phân quyền (Admin, Giảng viên, Sinh viên)
3. **Students** - Thông tin sinh viên
4. **Lecturers** - Thông tin giảng viên
5. **Classes** - Lớp học
6. **Subjects** - Môn học
7. **Grades** - Điểm số (CC, TH, GK, CK)
8. **Tickets** - Hệ thống hỏi đáp
9. **Assignments** - Bài tập
10. **Submissions** - Bài nộp
11. **Course_Materials** - Tài liệu học tập
12. **Chatbot_Logs** 🤖 - Lịch sử chat AI (mới)

### Dữ liệu mẫu có sẵn:

-   ✅ 80 sinh viên (sv001-sv080)
-   ✅ 3 giảng viên (gv001-gv003)
-   ✅ 1 admin
-   ✅ 240+ điểm số mẫu
-   ✅ Dữ liệu tickets, assignments, course materials

## 🐛 Troubleshooting (Xử lý lỗi)

### ❌ Lỗi kết nối Database

**Triệu chứng:** `Error: Access denied for user 'root'@'localhost'`

**Giải pháp:**

```bash
# Kiểm tra MySQL đang chạy
mysql -u root -p

# Kiểm tra lại thông tin trong .env
DB_USER=root
DB_PASSWORD=your_correct_password
DB_NAME=qlsv
```

### ❌ Lỗi "Database qlsv does not exist"

**Giải pháp:**

```sql
CREATE DATABASE qlsv CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### ❌ Lỗi Upload File

**Triệu chứng:** `ENOENT: no such file or directory, open 'uploads/...'`

**Giải pháp:**

```bash
# Tạo thư mục uploads
mkdir back-end\uploads
```

### ❌ Lỗi JWT Invalid Token

**Triệu chứng:** `JsonWebTokenError: invalid signature`

**Giải pháp:**

-   Đảm bảo `JWT_SECRET` trong `.env` có **ít nhất 32 ký tự**
-   Đăng xuất và đăng nhập lại

### ❌ Lỗi AI Chatbot không hoạt động

**Triệu chứng:** `Error: API key not valid`

**Giải pháp:**

1. Lấy API key mới tại: https://aistudio.google.com/app/apikey
2. Thêm vào `.env`: `GEMINI_API_KEY=your_key_here`
3. Restart backend: `npm start`

### ❌ Lỗi Port đã được sử dụng

**Triệu chứng:** `Error: listen EADDRINUSE: address already in use :::8080`

**Giải pháp:**

```powershell
# Tìm process đang dùng port 8080
netstat -ano | findstr :8080

# Kill process (thay PID bằng số tìm được)
taskkill /PID <PID> /F
```

## 📚 API Documentation

### Authentication

-   `POST /api/auth/login` - Đăng nhập
-   `POST /api/auth/forgot-password` - Quên mật khẩu
-   `POST /api/auth/verify-otp` - Xác thực OTP
-   `POST /api/auth/reset-password` - Đặt lại mật khẩu

### Chatbot 🤖 (Mới)

-   `POST /api/chatbot/ask` - Gửi câu hỏi cho AI
-   `GET /api/chatbot/history` - Lấy lịch sử chat

### Grades

-   `GET /api/grades/student/:id` - Xem điểm sinh viên
-   `POST /api/grades` - Nhập điểm (Giảng viên)
-   `PUT /api/grades/:id` - Sửa điểm

### Tickets

-   `GET /api/tickets` - Danh sách tickets
-   `POST /api/tickets` - Tạo ticket mới
-   `PUT /api/tickets/:id/respond` - Phản hồi ticket

### Assignments

-   `GET /api/assignments` - Danh sách bài tập
-   `POST /api/assignments` - Tạo bài tập (Giảng viên)
-   `POST /api/submissions` - Nộp bài (Sinh viên)

> 📖 **Chi tiết đầy đủ:** Xem file `back-end/src/routes/` để biết thêm endpoints

## ⚠️ Lưu ý quan trọng

### Bảo mật:

-   🔒 **KHÔNG push file `.env` lên Git** (đã có trong `.gitignore`)
-   🔑 Đổi `JWT_SECRET` thành chuỗi phức tạp trước khi deploy production
-   🔐 Đổi mật khẩu mặc định của tài khoản admin
-   🚫 KHÔNG share `GEMINI_API_KEY` công khai

### Production:

-   ☁️ File upload nên dùng **Cloud Storage** (AWS S3, Cloudinary) thay vì lưu local
-   🗄️ OTP hiện lưu trong memory, nên chuyển sang **Redis** cho production
-   🔄 Cấu hình **CORS** phù hợp với domain thực tế
-   🚀 Sử dụng **PM2** để chạy Node.js ổn định

### Giới hạn:

-   📊 Gemini API Free: **60 requests/phút** (đủ cho học tập)
-   💾 Upload file tối đa: **10MB** (có thể tăng trong `uploadMiddleware.js`)
-   🔐 OTP hết hiệu lực sau: **5 phút**

## 🎯 Roadmap & Tính năng tương lai

-   [ ] 📧 Gửi email thông báo điểm, deadline
-   [ ] 📱 Mobile app (React Native)
-   [ ] 🔔 Hệ thống notification real-time (Socket.io)
-   [ ] 📊 Thêm biểu đồ phân tích nâng cao
-   [ ] 🎤 Voice input cho AI chatbot
-   [ ] 🌐 Multi-language support
-   [ ] 📄 Export điểm ra Excel/PDF
-   [ ] 🤝 Tích hợp Microsoft Teams/Google Classroom

## 🤝 Đóng góp (Contributing)

Mọi đóng góp đều được chào đón!

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

MIT License - Dự án học tập tại **Học viện Công nghệ Bưu chính Viễn thông (PTIT)**

## 👨‍💻 Tác giả

-   **GitHub:** [@DucNgoc1824](https://github.com/DucNgoc1824)
-   **Repository:** [Giua_ky_web](https://github.com/DucNgoc1824/Giua_ky_web)
-   **Email:** ducngoc1824@ptit.edu.vn

## 🙏 Acknowledgments

-   🎓 **PTIT** - Học viện Công nghệ Bưu chính Viễn thông
-   🤖 **Google Gemini AI** - AI chatbot engine
-   🎨 **React Icons** - Beautiful icons
-   📊 **Recharts** - Chart library

---

<p align="center">
  <strong>⭐ Nếu thấy project hữu ích, hãy cho 1 star nhé! ⭐</strong>
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/DucNgoc1824">DucNgoc1824</a>
</p>

````

Made with ❤️ by PTIT Students

## 🔑 Tính năng chính

### 1. Dashboard

-   **Admin**: Tổng số sinh viên, giảng viên, lớp học, môn học
-   **Giảng viên**: Số lớp đang dạy, sinh viên, bài tập, thắc mắc
-   **Sinh viên**: GPA, số môn học, bài tập, thắc mắc
-   Biểu đồ phân bổ điểm, hoạt động gần đây

### 2. Quản lý Users (Admin)

-   CRUD sinh viên, giảng viên, lớp học, môn học
-   Tìm kiếm, phân trang

### 3. Quản lý Điểm

-   **Giảng viên**: Nhập/sửa điểm (CC 10%, TH 20%, GK 20%, CK 50%)
-   **Sinh viên**: Xem điểm theo môn/học kỳ
-   Tính điểm tổng kết + điểm chữ (A+, A, B+, ...)
-   Tìm kiếm sinh viên theo tên

### 4. Tài liệu học tập

-   **Giảng viên/Admin**: Upload tài liệu (PDF, DOC, PPT, ZIP)
-   **Sinh viên**: Download tài liệu
-   Lọc theo môn học

### 5. Hỏi đáp/Góp ý (Tickets)

-   **Sinh viên**: Gửi thắc mắc, xem chi tiết phản hồi
-   **Giảng viên**: Xem inbox, phản hồi thắc mắc
-   Trạng thái: Mới → Đã phản hồi

### 6. Bài tập (Assignments)

-   **Giảng viên**:
    -   Tạo bài tập (tiêu đề, mô tả, hạn nộp, môn học, lớp)
    -   Xem danh sách nộp bài
    -   Chấm điểm + phản hồi
-   **Sinh viên**:
    -   Xem danh sách bài tập
    -   Nộp bài (text + file)
    -   Trạng thái: Chưa nộp / Đã nộp / Quá hạn

### 7. Quên mật khẩu

-   Nhập username → Nhận OTP (6 số, hết hạn 5 phút)
-   Nhập OTP + mật khẩu mới
-   Giới hạn 3 lần nhập sai

### 8. Giao diện

-   Responsive design (Desktop/Tablet/Mobile)
-   Dark mode toggle
-   Toast notifications
-   Loading states
-   Breadcrumb navigation
-   Pagination (10 items/page)

## �️ Database Schema

### Core Tables

-   **Users**: user_id, username, password_hash, full_name, email, role_id
-   **Roles**: role_id (1: Admin, 2: Lecturer, 3: Student)
-   **Students**: student_id, student_code, user_id, class_id
-   **Lecturers**: lecturer_id, lecturer_code, user_id, department
-   **Classes**: class_id, class_code, major
-   **Subjects**: subject_id, subject_code, subject_name, credits

### Feature Tables

-   **Grades**: grade_id, student_id, subject_id, semester, attendance_score, practice_score, midterm_score, final_score, total_score, letter_grade
-   **Course_Materials**: material_id, subject_id, title, url, added_by_user_id
-   **Tickets**: ticket_id, student_id, subject_id, lecturer_id, message_text, response_text, status
-   **Assignments**: assignment_id, title, description, due_date, subject_id, lecturer_id, class_id
-   **Submissions**: submission_id, assignment_id, student_id, file_path, submission_text, score, feedback, status
-   **Lecturer_Assignments**: assignment_id, lecturer_id, subject_id, class_id, semester

## 📝 API Endpoints

### Authentication

```
POST   /api/auth/register         - Đăng ký tài khoản
POST   /api/auth/login            - Đăng nhập
GET    /api/auth/me               - Lấy thông tin user
POST   /api/auth/forgot-password  - Yêu cầu OTP
POST   /api/auth/reset-password   - Đặt lại mật khẩu
```

### Students

```
GET    /api/students              - Lấy danh sách sinh viên (Admin)
POST   /api/students              - Tạo sinh viên mới (Admin)
PUT    /api/students/:id          - Cập nhật sinh viên (Admin)
DELETE /api/students/:id          - Xóa sinh viên (Admin)
GET    /api/students/search       - Tìm kiếm sinh viên
```

### Grades

```
GET    /api/grades/my-grades      - Xem điểm của mình (Student)
GET    /api/grades/subject/:id    - Xem điểm theo môn (Lecturer)
POST   /api/grades                - Nhập điểm (Lecturer)
PUT    /api/grades/:id            - Sửa điểm (Lecturer)
```

### Assignments

```
GET    /api/assignments           - Lấy danh sách bài tập
GET    /api/assignments/:id       - Chi tiết bài tập
POST   /api/assignments           - Tạo bài tập (Lecturer)
PUT    /api/assignments/:id       - Sửa bài tập (Lecturer)
DELETE /api/assignments/:id       - Xóa bài tập (Lecturer)
POST   /api/assignments/submit    - Nộp bài (Student)
GET    /api/assignments/:id/submissions - Xem danh sách nộp bài (Lecturer)
PUT    /api/assignments/submissions/:id/grade - Chấm điểm (Lecturer)
```

### Tickets

```
POST   /api/tickets               - Gửi thắc mắc (Student)
GET    /api/tickets/my-tickets    - Xem thắc mắc của mình (Student)
GET    /api/tickets/inbox         - Xem inbox (Lecturer)
GET    /api/tickets/:id           - Chi tiết ticket
PUT    /api/tickets/:id/respond   - Phản hồi ticket (Lecturer)
```

### Materials

```
GET    /api/materials             - Lấy danh sách tài liệu
POST   /api/materials             - Upload tài liệu (Lecturer/Admin)
DELETE /api/materials/:id         - Xóa tài liệu (Lecturer/Admin)
```

### Dashboard

```
GET    /api/dashboard/admin       - Dashboard admin
GET    /api/dashboard/lecturer    - Dashboard giảng viên
GET    /api/dashboard/student     - Dashboard sinh viên
```

## � Bảo mật

-   ✅ JWT authentication
-   ✅ Password hashing với bcrypt (10 salt rounds)
-   ✅ Role-based access control (Admin, Lecturer, Student)
-   ✅ Protected routes (frontend + backend)
-   ✅ File upload validation (type + size)
-   ✅ SQL injection prevention (prepared statements)
-   ✅ XSS protection
-   ⚠️ OTP in-memory (production: use Redis/Database)

## 🐛 Troubleshooting

### Lỗi kết nối database

```bash
# Kiểm tra MySQL đang chạy
mysql -u root -p

# Kiểm tra .env file
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<your_password>
DB_NAME=qlsv
```

### Lỗi CORS

-   Đảm bảo backend chạy port 8080
-   Frontend config proxy trong vite.config.js

### Lỗi upload file

```bash
# Tạo folder uploads nếu chưa có
mkdir back-end\uploads
```

### Lỗi JWT

-   Đảm bảo JWT_SECRET trong .env không rỗng
-   Token hết hạn sau 1 giờ

## 🚧 Tính năng sắp tới

-   [ ] Email integration (gửi OTP thật qua email)
-   [ ] Export Excel/PDF
-   [ ] Import sinh viên/điểm từ Excel
-   [ ] Schedule & Calendar
-   [ ] Notifications realtime
-   [ ] Chat giữa giảng viên - sinh viên

## � Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repo
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## � License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 📞 Liên hệ

-   **Email**: your.email@ptit.edu.vn
-   **GitHub**: [@DucNgoc1824](https://github.com/DucNgoc1824)
-   **Project Link**: [https://github.com/DucNgoc1824/Giua_ky_web](https://github.com/DucNgoc1824/Giua_ky_web)

---

Made with ❤️ by PTIT Students

---

## 📞 Liên hệ

Nếu có vấn đề, tạo [Issue](https://github.com/DucNgoc1824/Giua_ky_web/issues) trên GitHub.

---

**⭐ Nếu bạn thấy dự án hữu ích, hãy cho một star nhé!**
````
