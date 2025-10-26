-- ============================================-- ============================================
-- HỆ THỐNG QUẢN LÝ SINH VIÊN - DATABASE SCHEMA-- HỆ THỐNG QUẢN LÝ SINH VIÊN - DATABASE SCHEMA
-- ============================================-- ============================================
-- Khớp với sơ đồ MySQL Workbench-- Tạo database và các bảng cần thiết
-- Version: 1.0 -- Version: 1.0
-- Date: October 2024-- Date: 2024
-- ============================================-- ============================================
-- 1. TẠO DATABASE
-- 1. TẠO DATABASECREATE DATABASE IF NOT EXISTS qlsv CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS qlsv CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qlsv;
USE qlsv;
-- ============================================
-- 2. BẢNG QUẢN LÝ NGƯỜI DÙNG
-- ============================================-- ============================================
-- 2. BẢNG QUẢN LÝ NGƯỜI DÙNG & VAI TRÒ-- Bảng Users: Tài khoản đăng nhập
-- ============================================CREATE TABLE Users (
user_id INT AUTO_INCREMENT PRIMARY KEY,
-- Bảng Roles: Định nghĩa vai trò    username VARCHAR(50) NOT NULL UNIQUE,
CREATE TABLE Roles (
    password VARCHAR(255) NOT NULL,
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL COMMENT '1=Admin, 2=Lecturer, 3=Student',
    role_name VARCHAR(50) NOT NULL UNIQUE full_name VARCHAR(100) NOT NULL,
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
email VARCHAR(100),
phone VARCHAR(20),
-- Thêm dữ liệu roles mặc định    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
INSERT INTO Roles (role_id, role_name)
VALUES updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    (1, 'Admin'),
    INDEX idx_username (username),
    (2, 'Lecturer'),
    INDEX idx_role (role_id) (3, 'Student');
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Bảng Users: Tài khoản đăng nhập-- Bảng Students: Thông tin sinh viên
CREATE TABLE Users (
    CREATE TABLE Students (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        user_id INT NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        student_code VARCHAR(50) NOT NULL UNIQUE,
        full_name VARCHAR(100) NOT NULL,
        class_id INT,
        email VARCHAR(100),
        date_of_birth DATE,
        role_id INT NOT NULL,
        address VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES Roles(role_id),
        INDEX idx_student_code (student_code),
        INDEX idx_username (username),
        INDEX idx_class (class_id) INDEX idx_role (role_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Bảng Lecturers: Thông tin giảng viên
-- Bảng Students: Thông tin sinh viên  CREATE TABLE Lecturers (
CREATE TABLE Students (
    lecturer_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    user_id INT NOT NULL UNIQUE,
    lecturer_code VARCHAR(50) NOT NULL UNIQUE,
    student_code VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(100),
    class_id INT,
    position VARCHAR(50),
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    address VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_lecturer_code (lecturer_code) FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
INDEX idx_student_code (student_code),
INDEX idx_class (class_id) -- ============================================
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 3. BẢNG QUẢN LÝ HỌC TẬP
-- ============================================
-- Bảng Lecturers: Thông tin giảng viên
CREATE TABLE Lecturers (
    -- Bảng Classes: Lớp học
    lecturer_id INT AUTO_INCREMENT PRIMARY KEY,
    CREATE TABLE Classes (
        user_id INT NOT NULL UNIQUE,
        class_id INT AUTO_INCREMENT PRIMARY KEY,
        lecturer_code VARCHAR(50) NOT NULL UNIQUE,
        class_code VARCHAR(50) NOT NULL UNIQUE,
        department VARCHAR(100),
        class_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        major VARCHAR(100),
        FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_lecturer_code (lecturer_code) INDEX idx_class_code (class_code)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================-- Bảng Subjects: Môn học
-- 3. BẢNG QUẢN LÝ HỌC TẬPCREATE TABLE Subjects (
-- ============================================  subject_id INT AUTO_INCREMENT PRIMARY KEY,
subject_code VARCHAR(50) NOT NULL UNIQUE,
-- Bảng Classes: Lớp học  subject_name VARCHAR(150) NOT NULL,
CREATE TABLE Classes (
    credits INT DEFAULT 3,
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    class_code VARCHAR(50) NOT NULL UNIQUE,
    INDEX idx_subject_code (subject_code) class_name VARCHAR(100),
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
major VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- Bảng Grades: Điểm số
INDEX idx_class_code (class_code) CREATE TABLE Grades () ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
grade_id INT AUTO_INCREMENT PRIMARY KEY,
student_id INT NOT NULL,
-- Bảng Subjects: Môn học  subject_id INT NOT NULL,
CREATE TABLE Subjects (
    midterm_score FLOAT,
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    final_score FLOAT,
    subject_code VARCHAR(50) NOT NULL UNIQUE,
    semester VARCHAR(50),
    subject_name VARCHAR(150) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    credits INT DEFAULT 3,
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
    INDEX idx_subject_code (subject_code) UNIQUE KEY unique_grade (student_id, subject_id, semester),
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
INDEX idx_semester (semester)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Bảng Grades: Điểm số
CREATE TABLE Grades (
    -- ============================================
    grade_id INT AUTO_INCREMENT PRIMARY KEY,
    -- 4. BẢNG PHÂN CÔNG GIẢNG DẠY
    student_id INT NOT NULL,
    -- ============================================
    subject_id INT NOT NULL,
    midterm_score FLOAT,
    -- Bảng Lecturer_Subjects: Năng lực/Chuyên môn giảng viên (GV CÓ THỂ dạy môn nào)
    final_score FLOAT,
    CREATE TABLE Lecturer_Subjects (
        semester VARCHAR(50),
        lecturer_subject_id INT AUTO_INCREMENT PRIMARY KEY,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        lecturer_id INT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
        subject_id INT NOT NULL,
        FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_grade (student_id, subject_id, semester),
        FOREIGN KEY (lecturer_id) REFERENCES Lecturers(lecturer_id) ON DELETE CASCADE,
        INDEX idx_semester (semester) FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
UNIQUE KEY unique_lecturer_subject (lecturer_id, subject_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- 4. BẢNG PHÂN CÔNG GIẢNG DẠY-- Bảng Lecturer_Assignments: Phân công thực tế (GV ĐANG DẠY gì, lớp nào, HK nào)
-- ============================================CREATE TABLE Lecturer_Assignments (
assignment_id INT AUTO_INCREMENT PRIMARY KEY,
-- Bảng Lecturer_Subjects: Năng lực/Chuyên môn (GV CÓ THỂ dạy môn nào)  lecturer_id INT NOT NULL,
CREATE TABLE Lecturer_Subjects (
    subject_id INT NOT NULL,
    lecturer_subject_id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    lecturer_id INT NOT NULL,
    semester VARCHAR(50),
    subject_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lecturer_id) REFERENCES Lecturers(lecturer_id) ON DELETE CASCADE,
    FOREIGN KEY (lecturer_id) REFERENCES Lecturers(lecturer_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE CASCADE,
    UNIQUE KEY unique_lecturer_subject (lecturer_id, subject_id) INDEX idx_semester_assignment (semester)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Bảng Lecturer_Assignments: Phân công thực tế (GV ĐANG DẠY gì, lớp nào, HK nào)-- ============================================
CREATE TABLE Lecturer_Assignments (
    -- 5. BẢNG HỖ TRỢ HỌC TẬP
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    -- ============================================
    lecturer_id INT NOT NULL,
    subject_id INT NOT NULL,
    -- Bảng Course_Materials: Tài liệu học tập
    class_id INT NOT NULL,
    CREATE TABLE Course_Materials (
        semester VARCHAR(50),
        material_id INT AUTO_INCREMENT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        subject_id INT NOT NULL,
        FOREIGN KEY (lecturer_id) REFERENCES Lecturers(lecturer_id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
        url TEXT,
        FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE CASCADE,
        added_by_user_id INT,
        INDEX idx_semester_assignment (semester) created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
INDEX idx_subject_material (subject_id) -- ============================================) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- 5. BẢNG HỖ TRỢ HỌC TẬP
-- ============================================-- Bảng Tickets: Hỏi đáp/Khiếu nại
CREATE TABLE Tickets (
    -- Bảng Course_Materials: Tài liệu học tập  ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    CREATE TABLE Course_Materials (
        student_id INT NOT NULL,
        material_id INT AUTO_INCREMENT PRIMARY KEY,
        subject_id INT NOT NULL,
        subject_id INT NOT NULL,
        lecturer_id INT,
        title VARCHAR(255) NOT NULL,
        message_text VARCHAR(255) NOT NULL,
        url TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        added_by_user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
        INDEX idx_subject_material (subject_id) FOREIGN KEY (lecturer_id) REFERENCES Lecturers(lecturer_id) ON DELETE
        SET NULL,
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
INDEX idx_status (status),
INDEX idx_student_ticket (student_id) -- Bảng Tickets: Hỏi đáp/Khiếu nại) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE Tickets (
    -- ============================================
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    -- 6. DỮ LIỆU MẪU (OPTIONAL)
    student_id INT NOT NULL,
    -- ============================================
    subject_id INT NOT NULL,
    -- Thêm constraint cho Students.class_id sau khi tạo bảng Classes
    lecturer_id INT,
    ALTER TABLE Students message_text VARCHAR(255) NOT NULL,
    ADD CONSTRAINT fk_student_class FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE status VARCHAR(50) DEFAULT 'pending',
    SET NULL;
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- ============================================
FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
-- KẾT THÚC SCHEMA
FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
-- ============================================
FOREIGN KEY (lecturer_id) REFERENCES Lecturers(lecturer_id) ON DELETE
SET NULL,
    -- Để thêm dữ liệu mẫu, chạy file: sample_data.sql
    INDEX idx_status (status),
    INDEX idx_student_ticket (student_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- 6. RÀNG BUỘC BỔ SUNG
-- ============================================
-- Thêm constraint cho Students.class_id
ALTER TABLE Students
ADD CONSTRAINT fk_student_class FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE
SET NULL;
-- ============================================
-- KẾT THÚC SCHEMA
-- ============================================
-- Database đã hoàn chỉnh với 11 bảng:
-- 1. Roles (Vai trò)
-- 2. Users (Tài khoản)
-- 3. Students (Sinh viên)
-- 4. Lecturers (Giảng viên)
-- 5. Classes (Lớp học)
-- 6. Subjects (Môn học)
-- 7. Grades (Điểm số)
-- 8. Lecturer_Subjects (Năng lực GV)
-- 9. Lecturer_Assignments (Phân công GV)
-- 10. Course_Materials (Tài liệu)
-- 11. Tickets (Hỏi đáp)
--
-- ⚠️ LƯU Ý: Sau khi import, chạy scripts để tạo dữ liệu mẫu