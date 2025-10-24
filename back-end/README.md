# Student Management System - Backend

Hệ thống quản lý sinh viên - API Backend

## 🚀 Công nghệ sử dụng

-   **Node.js** + **Express.js** - Web framework
-   **MySQL** - Database
-   **JWT** - Authentication
-   **bcryptjs** - Password hashing
-   **Multer** - File upload

## 📋 Yêu cầu hệ thống

-   Node.js >= 14.x
-   MySQL >= 5.7
-   npm hoặc yarn

## ⚙️ Cài đặt

### 1. Clone repository và cài đặt dependencies

```bash
cd back-end
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Sau đó chỉnh sửa file `.env` với thông tin của bạn:

```env
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_management
JWT_SECRET=your_secret_key
```

### 3. Tạo database

Tạo database MySQL với tên `student_management` (hoặc tên bạn đã cấu hình trong `.env`)

### 4. Chạy server

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:8080`

## 📁 Cấu trúc thư mục

```
back-end/
├── src/
│   ├── config/          # Cấu hình database
│   ├── controllers/     # Business logic
│   ├── middleware/      # Authentication, upload middleware
│   ├── models/          # Database models
│   └── routes/          # API routes
├── scripts/             # Utility scripts
├── uploads/             # File uploads
├── .env                 # Environment variables (không commit)
├── .env.example         # Environment template
└── server.js            # Entry point
```

## 🔌 API Endpoints

### Authentication

-   `POST /api/auth/login` - Đăng nhập
-   `POST /api/auth/register` - Đăng ký (nếu có)

### Students

-   `GET /api/students` - Lấy danh sách sinh viên
-   `POST /api/students` - Tạo sinh viên mới
-   `PUT /api/students/:id` - Cập nhật sinh viên
-   `DELETE /api/students/:id` - Xóa sinh viên

### Lecturers

-   `GET /api/lecturers` - Lấy danh sách giảng viên
-   `POST /api/lecturers` - Tạo giảng viên mới
-   `PUT /api/lecturers/:id` - Cập nhật giảng viên
-   `DELETE /api/lecturers/:id` - Xóa giảng viên

### Classes, Subjects, Grades, Materials, Assignments, Tickets...

_(Tương tự, xem trong thư mục `src/routes/`)_

## 🔐 Authorization

API sử dụng JWT Bearer token. Thêm header:

```
Authorization: Bearer <your_token>
```

### Roles

-   **Admin** (roleId: 1) - Toàn quyền
-   **Lecturer** (roleId: 2) - Quản lý lớp, điểm
-   **Student** (roleId: 3) - Xem điểm, tài liệu

## 📝 Scripts hữu ích

```bash
# Chạy server với nodemon (auto-reload)
npm start

# Các script utility (trong thư mục scripts/)
node scripts/checkUsers.js
node scripts/updateAllPasswords.js
```

## 🛠️ Development

Để phát triển thêm tính năng:

1. Tạo model trong `src/models/`
2. Tạo controller trong `src/controllers/`
3. Tạo routes trong `src/routes/`
4. Import routes vào `server.js`

## 📄 License

MIT License - Dự án học tập
