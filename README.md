# 🎓 HỆ THỐNG QUẢN LÝ SINH VIÊN

Hệ thống quản lý sinh viên Full-stack với React, Node.js và MySQL.

## 📋 Mục lục

-   [Giới thiệu](#giới-thiệu)
-   [Tính năng](#tính-năng)
-   [Công nghệ sử dụng](#công-nghệ-sử-dụng)
-   [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
-   [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
-   [Cấu trúc dự án](#cấu-trúc-dự-án)
-   [API Endpoints](#api-endpoints)
-   [Phân quyền](#phân-quyền)

## 🌟 Giới thiệu

Hệ thống quản lý sinh viên là ứng dụng web giúp quản lý thông tin sinh viên, giảng viên, lớp học, môn học, điểm số và tài liệu học tập. Hệ thống hỗ trợ 3 vai trò: Admin, Giảng viên và Sinh viên.

## ✨ Tính năng

### 👤 Admin

-   ✅ Quản lý toàn bộ: Sinh viên, Giảng viên, Lớp, Môn học
-   ✅ Phân công giảng viên dạy môn học
-   ✅ Xem thống kê tổng quan hệ thống

### 👨‍🏫 Giảng viên

-   ✅ Quản lý lớp học được phân công
-   ✅ Nhập/cập nhật điểm sinh viên
-   ✅ Upload tài liệu môn học
-   ✅ Trả lời thắc mắc sinh viên

### 🎓 Sinh viên

-   ✅ Xem bảng điểm cá nhân
-   ✅ Tải tài liệu môn học
-   ✅ Gửi câu hỏi/khiếu nại về điểm

## 🛠️ Công nghệ sử dụng

### Frontend

-   **React 19** - UI Library
-   **React Router 7** - Routing
-   **Axios** - HTTP Client
-   **Vite** - Build Tool
-   **CSS3** - Styling

### Backend

-   **Node.js** - Runtime Environment
-   **Express.js 5** - Web Framework
-   **MySQL** - Database
-   **JWT** - Authentication
-   **bcryptjs** - Password Hashing
-   **Multer** - File Upload

## 💻 Yêu cầu hệ thống

-   **Node.js** >= 16.x
-   **MySQL** >= 8.0
-   **npm** hoặc **yarn**

## 📦 Hướng dẫn cài đặt

### 1. Clone repository

```bash
git clone https://github.com/DucNgoc1824/Giua_ky_web.git
cd Giua_ky_web
```

### 2. Cài đặt Backend

#### Bước 1: Di chuyển vào thư mục backend

```bash
cd back-end
```

#### Bước 2: Cài đặt dependencies

```bash
npm install
```

#### Bước 3: Tạo file `.env`

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
DB_NAME=qlsv
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173
```

#### Bước 4: Tạo database

**Cách 1: Import file SQL (Khuyến nghị)**

Mở MySQL và chạy:

```bash
mysql -u root -p < database/schema.sql
```

Hoặc trong MySQL Workbench/phpMyAdmin:

-   Mở file `back-end/database/schema.sql`
-   Chạy toàn bộ nội dung file

**Cách 2: Tạo thủ công**

```sql
CREATE DATABASE qlsv CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Sau đó import file `schema.sql` vào database vừa tạo.

#### Bước 5: Tạo dữ liệu mẫu (Optional)

Chạy các script trong thư mục `scripts/`:

```bash
# Tạo tài khoản mẫu
node scripts/checkUsers.js

# Gán môn học cho giảng viên
node scripts/assignLecturerSubjects.js

# Tạo phân công mẫu
node scripts/createSampleAssignments.js
```

#### Bước 6: Chạy server

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:8080`

---

### 3. Cài đặt Frontend

#### Bước 1: Di chuyển vào thư mục frontend (từ root)

```bash
cd front-end
```

#### Bước 2: Cài đặt dependencies

```bash
npm install
```

#### Bước 3: Tạo file `.env` (Optional)

Nếu cần thay đổi URL API:

```bash
cp .env.example .env
```

Chỉnh sửa:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

#### Bước 4: Chạy development server

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

### 4. Truy cập ứng dụng

Mở trình duyệt và truy cập: `http://localhost:5173`

**Tài khoản đăng nhập mặc định:**

| Username | Password | Role       |
| -------- | -------- | ---------- |
| admin    | 123456   | Admin      |
| gv01     | 123456   | Giảng viên |
| sv01     | 123456   | Sinh viên  |

> ⚠️ **Lưu ý:** Đổi mật khẩu ngay sau lần đăng nhập đầu tiên!

---

## 📁 Cấu trúc dự án

```
Giua_ky_web/
├── back-end/                   # Backend (Node.js + Express)
│   ├── database/               # Database schemas
│   │   └── schema.sql         # SQL schema file
│   ├── scripts/               # Utility scripts
│   ├── src/
│   │   ├── config/            # Database config
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth, upload middleware
│   │   ├── models/            # Database models
│   │   └── routes/            # API routes
│   ├── uploads/               # Uploaded files
│   ├── .env.example           # Environment template
│   ├── package.json
│   └── server.js              # Entry point
│
├── front-end/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/            # CSS files
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React Context
│   │   ├── layouts/           # Layout components
│   │   ├── pages/             # Page components
│   │   └── services/          # API services
│   ├── .env.example           # Environment template
│   ├── package.json
│   └── vite.config.js
│
└── README.md                   # This file
```

---

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/login         - Đăng nhập
POST   /api/auth/register      - Đăng ký (nếu có)
```

### Students

```
GET    /api/students           - Lấy danh sách sinh viên
POST   /api/students           - Tạo sinh viên mới (Admin)
GET    /api/students/:id       - Chi tiết sinh viên
PUT    /api/students/:id       - Cập nhật sinh viên (Admin)
DELETE /api/students/:id       - Xóa sinh viên (Admin)
```

### Lecturers

```
GET    /api/lecturers          - Lấy danh sách giảng viên
POST   /api/lecturers          - Tạo giảng viên (Admin)
PUT    /api/lecturers/:id      - Cập nhật giảng viên (Admin)
DELETE /api/lecturers/:id      - Xóa giảng viên (Admin)
```

### Classes, Subjects, Grades...

_(Tương tự pattern trên)_

📚 **Chi tiết đầy đủ:** Xem file `back-end/src/routes/`

---

## 🔐 Phân quyền

| Chức năng         | Admin | Giảng viên | Sinh viên    |
| ----------------- | ----- | ---------- | ------------ |
| Quản lý Users     | ✅    | ❌         | ❌           |
| Quản lý Lớp/Môn   | ✅    | ❌         | ❌           |
| Phân công GV      | ✅    | ❌         | ❌           |
| Nhập điểm         | ✅    | ✅         | ❌           |
| Xem điểm          | ✅    | ✅         | ✅ (cá nhân) |
| Upload tài liệu   | ✅    | ✅         | ❌           |
| Download tài liệu | ✅    | ✅         | ✅           |
| Gửi ticket        | ❌    | ❌         | ✅           |
| Trả lời ticket    | ✅    | ✅         | ❌           |

---

## 🚀 Build cho Production

### Backend

```bash
cd back-end
npm start
```

### Frontend

```bash
cd front-end
npm run build
npm run preview
```

---

## 🐛 Troubleshooting

### Lỗi kết nối database

-   Kiểm tra MySQL đã chạy chưa
-   Kiểm tra thông tin trong file `.env`
-   Đảm bảo database `qlsv` đã được tạo

### Lỗi CORS

-   Kiểm tra `FRONTEND_URL` trong `.env` backend
-   Đảm bảo frontend chạy đúng port

### Lỗi upload file

-   Kiểm tra thư mục `uploads/` đã tồn tại
-   Kiểm tra quyền ghi file

---

## 📝 License

MIT License - Dự án học tập

---

## 👨‍💻 Tác giả

**Họ tên:** [Tên của bạn]  
**MSSV:** [Mã số sinh viên]  
**Email:** [email của bạn]  
**GitHub:** [DucNgoc1824](https://github.com/DucNgoc1824)

---

## 📞 Liên hệ

Nếu có vấn đề, tạo [Issue](https://github.com/DucNgoc1824/Giua_ky_web/issues) trên GitHub.

---

**⭐ Nếu bạn thấy dự án hữu ích, hãy cho một star nhé!**
