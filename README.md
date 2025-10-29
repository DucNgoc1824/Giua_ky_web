# 🎓 Hệ Thống Quản Lý Sinh Viên PTIT# 🎓 Hệ Thống Quản Lý Sinh Viên PTIT

Ứng dụng web full-stack quản lý sinh viên với React, Node.js và MySQL.Ứng dụng web full-stack quản lý sinh viên với React, Node.js và MySQL.

## ✨ Tính năng## ✨ Tính năng

-   🔐 Đăng nhập phân quyền (Admin, Giảng viên, Sinh viên)- 🔐 Đăng nhập phân quyền (Admin, Giảng viên, Sinh viên)

-   📊 Dashboard thống kê với biểu đồ- 📊 Dashboard thống kê với biểu đồ

-   📝 Quản lý điểm (CC 10%, TH 20%, GK 20%, CK 50%)- 📝 Quản lý điểm (CC 10%, TH 20%, GK 20%, CK 50%)

-   📚 Upload/Download tài liệu học tập- 📚 Upload/Download tài liệu học tập

-   💬 Hệ thống hỏi đáp với phản hồi- 💬 Hệ thống hỏi đáp với phản hồi

-   📋 Quản lý bài tập và nộp bài- 📋 Quản lý bài tập và nộp bài

-   🔑 Quên mật khẩu (OTP)- 🔑 Quên mật khẩu (OTP)

-   🌙 Dark mode- 🌙 Dark mode

## 🛠️ Công nghệ## 🛠️ Công nghệ

**Backend:** Node.js, Express, MySQL, JWT, bcrypt, Multer **Backend:** Node.js, Express, MySQL, JWT, bcrypt, Multer

**Frontend:** React 18, Vite, React Router, Axios, React Toastify**Frontend:** React 18, Vite, React Router, Axios, React Toastify

## 📦 Yêu cầu### Backend

-   Node.js >= 16.x- **Node.js** - Runtime Environment

-   MySQL >= 8.0- **Express.js 5** - Web Framework

-   npm hoặc yarn- **MySQL** - Database

-   **JWT** - Authentication

## 🚀 Cài đặt- **bcryptjs** - Password Hashing

-   **Multer** - File Upload

### 1. Clone repository

## 💻 Yêu cầu hệ thống

````bash

git clone https://github.com/DucNgoc1824/Giua_ky_web.git-   **Node.js** >= 16.x

cd Giua_ky_web-   **MySQL** >= 8.0

```-   **npm** hoặc **yarn**



### 2. Cài đặt Backend## 📦 Yêu cầu hệ thống



```bash- **Node.js**: >= 16.x

cd back-end- **MySQL**: >= 8.0

npm install- **npm** hoặc **yarn**

````

## 🚀 Hướng dẫn cài đặt

**Tạo file `.env`:**

````env### 1. Clone repository

DB_HOST=localhost

DB_USER=root```bash

DB_PASSWORD=your_passwordgit clone https://github.com/DucNgoc1824/Giua_ky_web.git

DB_NAME=qlsvcd Giua_ky_web

JWT_SECRET=your_secret_key_min_32_characters```

PORT=8080

```### 2. Cài đặt Backend



### 3. Tạo Database```bash

cd back-end

**Tạo database:**npm install

```sql```

CREATE DATABASE qlsv CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

```### 3. Cấu hình Database



**Import schema và dữ liệu:**#### 3.1. Tạo database MySQL



Windows (PowerShell):```sql

```powershellCREATE DATABASE qlsv CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

Get-Content database\schema.sql | mysql -u root -p qlsv```

Get-Content database\sample_grades_80.sql | mysql -u root -p qlsv

```#### 3.2. Import schema và dữ liệu mẫu



Linux/Mac:**Trên Windows (PowerShell):**

```bash```powershell

mysql -u root -p qlsv < database/schema.sqlGet-Content database\schema.sql | mysql -u root -p qlsv

mysql -u root -p qlsv < database/sample_grades_80.sqlGet-Content database\sample_grades_80.sql | mysql -u root -p qlsv

````

### 4. Cài đặt Frontend**Trên Linux/Mac:**

````bash

```bashmysql -u root -p qlsv < database/schema.sql

cd ../front-endmysql -u root -p qlsv < database/sample_grades_80.sql

npm install```

````

#### 3.3. Chạy migrations (tùy chọn - nếu chưa có trong schema.sql)

### 5. Chạy ứng dụng

````powershell

**Terminal 1 - Backend:**Get-Content database\add_response_to_tickets.sql | mysql -u root -p qlsv

```bashGet-Content database\create_assignments_tables.sql | mysql -u root -p qlsv

cd back-end```

npm start

# Chạy tại http://localhost:8080### 4. Cấu hình Backend Environment

````

Tạo file `.env` trong folder `back-end/`:

**Terminal 2 - Frontend:**

`bash`env

cd front-end# Database

npm run devDB_HOST=localhost

# Chạy tại http://localhost:5173DB_USER=root

```````DB_PASSWORD=your_mysql_password

DB_NAME=qlsv

## 👤 Tài khoản mẫu

# JWT

| Role       | Username | Password |JWT_SECRET=your_super_secret_key_here_change_in_production

|------------|----------|----------|

| Admin      | admin    | password |# Server

| Giảng viên | gv001-gv003 | password |PORT=8080

| Sinh viên  | sv001-sv080 | password |```



## 📁 Cấu trúc### 5. Cài đặt Frontend



``````bash

Giua_ky_web/cd ../front-end

├── back-end/npm install

│   ├── database/          # SQL schemas (schema.sql, sample_grades_80.sql)```

│   ├── src/

│   │   ├── config/        # Database config### 6. Chạy ứng dụng

│   │   ├── controllers/   # Business logic

│   │   ├── models/        # Database queries#### Terminal 1 - Backend:

│   │   ├── routes/        # API endpoints```bash

│   │   ├── middleware/    # Auth & uploadcd back-end

│   │   └── utils/         # Helpers (OTP)npm start

│   ├── uploads/           # Uploaded files# Server chạy tại: http://localhost:8080

│   └── server.js```

└── front-end/

    ├── src/#### Terminal 2 - Frontend:

    │   ├── components/    # Reusable components```bash

    │   ├── pages/         # Page componentscd front-end

    │   ├── services/      # API callsnpm run dev

    │   └── context/       # Auth & Theme# App chạy tại: http://localhost:5173

    └── App.jsx```

```````

## 👤 Tài khoản mẫu

## 🗄️ Database

### Admin

11 bảng: Users, Roles, Students, Lecturers, Classes, Subjects, Grades, Tickets, Assignments, Submissions, Course_Materials, Lecturer_Assignments- **Username**: `admin`

-   **Password**: `password`

**Dữ liệu mẫu:**

-   80 sinh viên (sv001-sv080)### Giảng viên

-   3 giảng viên (gv001-gv003)- **Username**: `gv001`, `gv002`, `gv003`

-   1 admin (admin)- **Password**: `password`

-   240 điểm số

### Sinh viên

## 🐛 Troubleshooting- **Username**: `sv001`, `sv002`, ..., `sv080`

-   **Password**: `password`

**Lỗi kết nối database:**

-   Kiểm tra MySQL đang chạy: `mysql -u root -p`## 📁 Cấu trúc dự án

-   Kiểm tra thông tin trong `.env`

-   Đảm bảo database `qlsv` đã tạo```

Giua_ky_web/

**Lỗi upload file:**├── back-end/

````bash│ ├── database/          # SQL schemas & migrations

mkdir back-end\uploads│   ├── scripts/           # Utility scripts

```│   ├── src/

│   │   ├── config/        # Database config

**Lỗi JWT:**│   │   ├── controllers/   # Business logic

- Đảm bảo `JWT_SECRET` có ít nhất 32 ký tự│   │   ├── models/        # Database queries

│   │   ├── routes/        # API endpoints

## ⚠️ Lưu ý│   │   ├── middleware/    # Auth & upload middleware

│   │   └── utils/         # Helpers (OTP store)

- ⚠️ **KHÔNG push file `.env` lên Git** (đã có trong .gitignore)│   ├── uploads/           # Uploaded files

- ⚠️ Đổi `JWT_SECRET` trước khi deploy production│   ├── .env               # Environment variables

- ⚠️ OTP hiện tại lưu trong memory, production nên dùng Redis│   └── server.js          # Entry point

- ⚠️ File upload hiện lưu local, production nên dùng Cloud Storage│

└── front-end/

## 📄 License    ├── src/

    │   ├── assets/        # CSS files

MIT License - Dự án học tập    │   ├── components/    # Reusable components

    │   ├── context/       # React Context (Auth, Theme)

## 👨‍💻 Liên hệ    │   ├── layouts/       # Layout components

    │   ├── pages/         # Page components

- GitHub: [@DucNgoc1824](https://github.com/DucNgoc1824)    │   ├── services/      # API services

- Email: your.email@ptit.edu.vn    │   └── utils/         # Utility functions

    ├── App.jsx            # Main app component

---    └── main.jsx           # Entry point

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
