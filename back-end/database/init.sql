-- =============================================================================
-- HỆ THỐNG QUẢN LÝ SINH VIÊN - KHỞI TẠO DATABASE HOÀN CHỈNH
-- =============================================================================
-- File này bao gồm:
-- 1. Tạo database và các bảng (schema)
-- 2. Dữ liệu mẫu (sample data)
-- 3. Tất cả các ALTER cần thiết
-- =============================================================================
CREATE DATABASE IF NOT EXISTS qlsv CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qlsv;
-- =============================================================================
-- PHẦN 1: TẠO CÁC BẢNG (SCHEMA)
-- =============================================================================
-- 1. Roles
CREATE TABLE IF NOT EXISTS Roles (
    role_id TINYINT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
INSERT INTO Roles (role_id, role_name)
VALUES (1, 'Admin'),
    (2, 'Lecturer'),
    (3, 'Student') ON DUPLICATE KEY
UPDATE role_name =
VALUES(role_name);
-- 2. Users
CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    full_name VARCHAR(100) NOT NULL,
    role_id TINYINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role (role_id),
    INDEX idx_username (username),
    FOREIGN KEY (role_id) REFERENCES Roles(role_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 3. Classes
CREATE TABLE IF NOT EXISTS Classes (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    class_code VARCHAR(50) NOT NULL UNIQUE,
    class_name VARCHAR(100) NOT NULL,
    major VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_class_code (class_code)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 4. Students
CREATE TABLE IF NOT EXISTS Students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    student_code VARCHAR(50) NOT NULL UNIQUE,
    date_of_birth DATE,
    address VARCHAR(255),
    class_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_student_code (student_code),
    INDEX idx_class (class_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE
    SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 5. Lecturers
CREATE TABLE IF NOT EXISTS Lecturers (
    lecturer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    lecturer_code VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(100),
    position VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_lecturer_code (lecturer_code),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 6. Subjects
CREATE TABLE IF NOT EXISTS Subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_code VARCHAR(50) NOT NULL UNIQUE,
    subject_name VARCHAR(150) NOT NULL,
    credits INT DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_subject_code (subject_code)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 7. Grades (Hệ thống điểm chuẩn PTIT)
CREATE TABLE IF NOT EXISTS Grades (
    grade_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    semester VARCHAR(50),
    -- 4 cột điểm thành phần
    attendance_score FLOAT CHECK (
        attendance_score >= 0
        AND attendance_score <= 10
    ),
    -- Chuyên cần (10%)
    practice_score FLOAT CHECK (
        practice_score >= 0
        AND practice_score <= 10
    ),
    -- Thực hành (20%)
    midterm_score FLOAT CHECK (
        midterm_score >= 0
        AND midterm_score <= 10
    ),
    -- Giữa kỳ (20%)
    final_score FLOAT CHECK (
        final_score >= 0
        AND final_score <= 10
    ),
    -- Cuối kỳ (50%)
    -- Điểm tổng kết (tính tự động)
    total_score FLOAT GENERATED ALWAYS AS (
        CASE
            WHEN attendance_score IS NOT NULL
            AND practice_score IS NOT NULL
            AND midterm_score IS NOT NULL
            AND final_score IS NOT NULL THEN ROUND(
                attendance_score * 0.1 + practice_score * 0.2 + midterm_score * 0.2 + final_score * 0.5,
                2
            )
            ELSE NULL
        END
    ) STORED,
    -- Điểm chữ theo chuẩn PTIT (tính tự động)
    letter_grade VARCHAR(5) GENERATED ALWAYS AS (
        CASE
            WHEN attendance_score IS NULL
            OR practice_score IS NULL
            OR midterm_score IS NULL
            OR final_score IS NULL THEN NULL
            WHEN ROUND(
                attendance_score * 0.1 + practice_score * 0.2 + midterm_score * 0.2 + final_score * 0.5,
                2
            ) >= 9.5 THEN 'A+'
            WHEN ROUND(
                attendance_score * 0.1 + practice_score * 0.2 + midterm_score * 0.2 + final_score * 0.5,
                2
            ) >= 8.5 THEN 'A'
            WHEN ROUND(
                attendance_score * 0.1 + practice_score * 0.2 + midterm_score * 0.2 + final_score * 0.5,
                2
            ) >= 8.0 THEN 'B+'
            WHEN ROUND(
                attendance_score * 0.1 + practice_score * 0.2 + midterm_score * 0.2 + final_score * 0.5,
                2
            ) >= 7.0 THEN 'B'
            WHEN ROUND(
                attendance_score * 0.1 + practice_score * 0.2 + midterm_score * 0.2 + final_score * 0.5,
                2
            ) >= 6.5 THEN 'C+'
            WHEN ROUND(
                attendance_score * 0.1 + practice_score * 0.2 + midterm_score * 0.2 + final_score * 0.5,
                2
            ) >= 5.5 THEN 'C'
            WHEN ROUND(
                attendance_score * 0.1 + practice_score * 0.2 + midterm_score * 0.2 + final_score * 0.5,
                2
            ) >= 5.0 THEN 'D+'
            WHEN ROUND(
                attendance_score * 0.1 + practice_score * 0.2 + midterm_score * 0.2 + final_score * 0.5,
                2
            ) >= 4.0 THEN 'D'
            ELSE 'F'
        END
    ) STORED,
    -- Điểm hệ 4 theo chuẩn PTIT (tính tự động)
    gpa_score FLOAT GENERATED ALWAYS AS (
        CASE
            WHEN attendance_score IS NULL
            OR practice_score IS NULL
            OR midterm_score IS NULL
            OR final_score IS NULL THEN NULL
            WHEN ROUND(
                attendance_score * 0.1 + practice_score * 0.2 + midterm_score * 0.2 + final_score * 0.5,
                2
            ) >= 9.5 THEN 4.0
            WHEN ROUND(
                attendance_score * 0.1 + practice_score * 0.2 + midterm_score * 0.2 + final_score * 0.5,
                2
            ) >= 8.5 THEN 3.8
            WHEN ROUND(
                attendance_score * 0.1 + practice_score * 0.2 + midterm_score * 0.2 + final_score * 0.5,
                2
            ) >= 8.0 THEN 3.5
            WHEN ROUND(
                attendance_score * 0.1 + practice_score * 0.2 + midterm_score * 0.2 + final_score * 0.5,
                2
            ) >= 7.0 THEN 3.0
            WHEN ROUND(
                attendance_score * 0.1 + practice_score * 0.2 + midterm_score * 0.2 + final_score * 0.5,
                2
            ) >= 6.5 THEN 2.7
            WHEN ROUND(
                attendance_score * 0.1 + practice_score * 0.2 + midterm_score * 0.2 + final_score * 0.5,
                2
            ) >= 5.5 THEN 2.0
            WHEN ROUND(
                attendance_score * 0.1 + practice_score * 0.2 + midterm_score * 0.2 + final_score * 0.5,
                2
            ) >= 5.0 THEN 1.5
            WHEN ROUND(
                attendance_score * 0.1 + practice_score * 0.2 + midterm_score * 0.2 + final_score * 0.5,
                2
            ) >= 4.0 THEN 1.0
            ELSE 0
        END
    ) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_grade (student_id, subject_id, semester),
    INDEX idx_grade_student (student_id),
    INDEX idx_grade_subject (subject_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 8. Lecturer_Subjects (Khả năng dạy)
CREATE TABLE IF NOT EXISTS Lecturer_Subjects (
    lecturer_subject_id INT AUTO_INCREMENT PRIMARY KEY,
    lecturer_id INT NOT NULL,
    subject_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_lecturer_subject (lecturer_id, subject_id),
    INDEX idx_ls_lecturer (lecturer_id),
    INDEX idx_ls_subject (subject_id),
    FOREIGN KEY (lecturer_id) REFERENCES Lecturers(lecturer_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 9. Lecturer_Assignments (Phân công giảng dạy thực tế)
CREATE TABLE IF NOT EXISTS Lecturer_Assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    lecturer_id INT NOT NULL,
    subject_id INT NOT NULL,
    class_id INT NOT NULL,
    semester VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_assignment (lecturer_id, subject_id, class_id, semester),
    INDEX idx_la_lecturer (lecturer_id),
    INDEX idx_la_subject (subject_id),
    INDEX idx_la_class (class_id),
    FOREIGN KEY (lecturer_id) REFERENCES Lecturers(lecturer_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 10. Course_Materials (Tài liệu học tập)
CREATE TABLE IF NOT EXISTS Course_Materials (
    material_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    class_id INT,
    title VARCHAR(255) NOT NULL,
    url TEXT,
    file_type VARCHAR(20) DEFAULT 'document',
    added_by_user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cm_subject (subject_id),
    INDEX idx_cm_class (class_id),
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE
    SET NULL,
        FOREIGN KEY (added_by_user_id) REFERENCES Users(user_id) ON DELETE
    SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 11. Tickets (Hỏi đáp)
CREATE TABLE IF NOT EXISTS Tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    lecturer_id INT DEFAULT NULL,
    message_text TEXT NOT NULL,
    response_text TEXT,
    response_at TIMESTAMP NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ticket_student (student_id),
    INDEX idx_ticket_subject (subject_id),
    INDEX idx_ticket_status (status),
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
    FOREIGN KEY (lecturer_id) REFERENCES Lecturers(lecturer_id) ON DELETE
    SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 12. Chatbot_Logs (Tracking conversations)
CREATE TABLE IF NOT EXISTS Chatbot_Logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    confidence ENUM('high', 'low') DEFAULT 'high',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE
    SET NULL,
        INDEX idx_student_created (student_id, created_at),
        INDEX idx_subject (subject_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 13. Assignments (Bài tập) - Không có class_id
CREATE TABLE IF NOT EXISTS Assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date DATETIME,
    lecturer_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
    FOREIGN KEY (lecturer_id) REFERENCES Lecturers(lecturer_id) ON DELETE CASCADE,
    INDEX idx_subject (subject_id),
    INDEX idx_lecturer (lecturer_id),
    INDEX idx_due_date (due_date)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 14. Submissions (Nộp bài)
CREATE TABLE IF NOT EXISTS Submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    file_path VARCHAR(500),
    submission_text TEXT,
    score DECIMAL(5, 2),
    feedback TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('submitted', 'graded', 'late') DEFAULT 'submitted',
    FOREIGN KEY (assignment_id) REFERENCES Assignments(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    INDEX idx_assignment (assignment_id),
    INDEX idx_student (student_id),
    INDEX idx_status (status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- =============================================================================
-- PHẦN 2: DỮ LIỆU MẪU (SAMPLE DATA)
-- =============================================================================
-- 2.1. Users (1 Admin + 3 Lecturers + 80 Students)
-- Password: password123 (hash: $2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi)
DELETE FROM Users
WHERE role_id IN (1, 2, 3);
INSERT INTO Users (
        username,
        password_hash,
        full_name,
        email,
        phone,
        role_id
    )
VALUES -- Admin
    (
        'admin',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Quản trị viên',
        'admin@ptit.edu.vn',
        '0901234567',
        1
    ),
    -- Lecturers
    (
        'gv001',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Giảng viên 001',
        'gv001@ptit.edu.vn',
        '0902345678',
        2
    ),
    (
        'gv002',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Giảng viên 002',
        'gv002@ptit.edu.vn',
        '0903456789',
        2
    ),
    (
        'gv003',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Giảng viên 003',
        'gv003@ptit.edu.vn',
        '0904567890',
        2
    ),
    -- 80 Students (sv001 -> sv080)
    (
        'sv001',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 001',
        'sv001@student.ptit.edu.vn',
        '0911000001',
        3
    ),
    (
        'sv002',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 002',
        'sv002@student.ptit.edu.vn',
        '0911000002',
        3
    ),
    (
        'sv003',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 003',
        'sv003@student.ptit.edu.vn',
        '0911000003',
        3
    ),
    (
        'sv004',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 004',
        'sv004@student.ptit.edu.vn',
        '0911000004',
        3
    ),
    (
        'sv005',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 005',
        'sv005@student.ptit.edu.vn',
        '0911000005',
        3
    ),
    (
        'sv006',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 006',
        'sv006@student.ptit.edu.vn',
        '0911000006',
        3
    ),
    (
        'sv007',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 007',
        'sv007@student.ptit.edu.vn',
        '0911000007',
        3
    ),
    (
        'sv008',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 008',
        'sv008@student.ptit.edu.vn',
        '0911000008',
        3
    ),
    (
        'sv009',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 009',
        'sv009@student.ptit.edu.vn',
        '0911000009',
        3
    ),
    (
        'sv010',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 010',
        'sv010@student.ptit.edu.vn',
        '0911000010',
        3
    ),
    (
        'sv011',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 011',
        'sv011@student.ptit.edu.vn',
        '0911000011',
        3
    ),
    (
        'sv012',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 012',
        'sv012@student.ptit.edu.vn',
        '0911000012',
        3
    ),
    (
        'sv013',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 013',
        'sv013@student.ptit.edu.vn',
        '0911000013',
        3
    ),
    (
        'sv014',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 014',
        'sv014@student.ptit.edu.vn',
        '0911000014',
        3
    ),
    (
        'sv015',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 015',
        'sv015@student.ptit.edu.vn',
        '0911000015',
        3
    ),
    (
        'sv016',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 016',
        'sv016@student.ptit.edu.vn',
        '0911000016',
        3
    ),
    (
        'sv017',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 017',
        'sv017@student.ptit.edu.vn',
        '0911000017',
        3
    ),
    (
        'sv018',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 018',
        'sv018@student.ptit.edu.vn',
        '0911000018',
        3
    ),
    (
        'sv019',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 019',
        'sv019@student.ptit.edu.vn',
        '0911000019',
        3
    ),
    (
        'sv020',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 020',
        'sv020@student.ptit.edu.vn',
        '0911000020',
        3
    ),
    (
        'sv021',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 021',
        'sv021@student.ptit.edu.vn',
        '0911000021',
        3
    ),
    (
        'sv022',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 022',
        'sv022@student.ptit.edu.vn',
        '0911000022',
        3
    ),
    (
        'sv023',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 023',
        'sv023@student.ptit.edu.vn',
        '0911000023',
        3
    ),
    (
        'sv024',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 024',
        'sv024@student.ptit.edu.vn',
        '0911000024',
        3
    ),
    (
        'sv025',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 025',
        'sv025@student.ptit.edu.vn',
        '0911000025',
        3
    ),
    (
        'sv026',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 026',
        'sv026@student.ptit.edu.vn',
        '0911000026',
        3
    ),
    (
        'sv027',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 027',
        'sv027@student.ptit.edu.vn',
        '0911000027',
        3
    ),
    (
        'sv028',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 028',
        'sv028@student.ptit.edu.vn',
        '0911000028',
        3
    ),
    (
        'sv029',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 029',
        'sv029@student.ptit.edu.vn',
        '0911000029',
        3
    ),
    (
        'sv030',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 030',
        'sv030@student.ptit.edu.vn',
        '0911000030',
        3
    ),
    (
        'sv031',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 031',
        'sv031@student.ptit.edu.vn',
        '0911000031',
        3
    ),
    (
        'sv032',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 032',
        'sv032@student.ptit.edu.vn',
        '0911000032',
        3
    ),
    (
        'sv033',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 033',
        'sv033@student.ptit.edu.vn',
        '0911000033',
        3
    ),
    (
        'sv034',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 034',
        'sv034@student.ptit.edu.vn',
        '0911000034',
        3
    ),
    (
        'sv035',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 035',
        'sv035@student.ptit.edu.vn',
        '0911000035',
        3
    ),
    (
        'sv036',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 036',
        'sv036@student.ptit.edu.vn',
        '0911000036',
        3
    ),
    (
        'sv037',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 037',
        'sv037@student.ptit.edu.vn',
        '0911000037',
        3
    ),
    (
        'sv038',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 038',
        'sv038@student.ptit.edu.vn',
        '0911000038',
        3
    ),
    (
        'sv039',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 039',
        'sv039@student.ptit.edu.vn',
        '0911000039',
        3
    ),
    (
        'sv040',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 040',
        'sv040@student.ptit.edu.vn',
        '0911000040',
        3
    ),
    (
        'sv041',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 041',
        'sv041@student.ptit.edu.vn',
        '0911000041',
        3
    ),
    (
        'sv042',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 042',
        'sv042@student.ptit.edu.vn',
        '0911000042',
        3
    ),
    (
        'sv043',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 043',
        'sv043@student.ptit.edu.vn',
        '0911000043',
        3
    ),
    (
        'sv044',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 044',
        'sv044@student.ptit.edu.vn',
        '0911000044',
        3
    ),
    (
        'sv045',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 045',
        'sv045@student.ptit.edu.vn',
        '0911000045',
        3
    ),
    (
        'sv046',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 046',
        'sv046@student.ptit.edu.vn',
        '0911000046',
        3
    ),
    (
        'sv047',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 047',
        'sv047@student.ptit.edu.vn',
        '0911000047',
        3
    ),
    (
        'sv048',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 048',
        'sv048@student.ptit.edu.vn',
        '0911000048',
        3
    ),
    (
        'sv049',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 049',
        'sv049@student.ptit.edu.vn',
        '0911000049',
        3
    ),
    (
        'sv050',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 050',
        'sv050@student.ptit.edu.vn',
        '0911000050',
        3
    ),
    (
        'sv051',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 051',
        'sv051@student.ptit.edu.vn',
        '0911000051',
        3
    ),
    (
        'sv052',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 052',
        'sv052@student.ptit.edu.vn',
        '0911000052',
        3
    ),
    (
        'sv053',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 053',
        'sv053@student.ptit.edu.vn',
        '0911000053',
        3
    ),
    (
        'sv054',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 054',
        'sv054@student.ptit.edu.vn',
        '0911000054',
        3
    ),
    (
        'sv055',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 055',
        'sv055@student.ptit.edu.vn',
        '0911000055',
        3
    ),
    (
        'sv056',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 056',
        'sv056@student.ptit.edu.vn',
        '0911000056',
        3
    ),
    (
        'sv057',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 057',
        'sv057@student.ptit.edu.vn',
        '0911000057',
        3
    ),
    (
        'sv058',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 058',
        'sv058@student.ptit.edu.vn',
        '0911000058',
        3
    ),
    (
        'sv059',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 059',
        'sv059@student.ptit.edu.vn',
        '0911000059',
        3
    ),
    (
        'sv060',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 060',
        'sv060@student.ptit.edu.vn',
        '0911000060',
        3
    ),
    (
        'sv061',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 061',
        'sv061@student.ptit.edu.vn',
        '0911000061',
        3
    ),
    (
        'sv062',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 062',
        'sv062@student.ptit.edu.vn',
        '0911000062',
        3
    ),
    (
        'sv063',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 063',
        'sv063@student.ptit.edu.vn',
        '0911000063',
        3
    ),
    (
        'sv064',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 064',
        'sv064@student.ptit.edu.vn',
        '0911000064',
        3
    ),
    (
        'sv065',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 065',
        'sv065@student.ptit.edu.vn',
        '0911000065',
        3
    ),
    (
        'sv066',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 066',
        'sv066@student.ptit.edu.vn',
        '0911000066',
        3
    ),
    (
        'sv067',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 067',
        'sv067@student.ptit.edu.vn',
        '0911000067',
        3
    ),
    (
        'sv068',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 068',
        'sv068@student.ptit.edu.vn',
        '0911000068',
        3
    ),
    (
        'sv069',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 069',
        'sv069@student.ptit.edu.vn',
        '0911000069',
        3
    ),
    (
        'sv070',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 070',
        'sv070@student.ptit.edu.vn',
        '0911000070',
        3
    ),
    (
        'sv071',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 071',
        'sv071@student.ptit.edu.vn',
        '0911000071',
        3
    ),
    (
        'sv072',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 072',
        'sv072@student.ptit.edu.vn',
        '0911000072',
        3
    ),
    (
        'sv073',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 073',
        'sv073@student.ptit.edu.vn',
        '0911000073',
        3
    ),
    (
        'sv074',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 074',
        'sv074@student.ptit.edu.vn',
        '0911000074',
        3
    ),
    (
        'sv075',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 075',
        'sv075@student.ptit.edu.vn',
        '0911000075',
        3
    ),
    (
        'sv076',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 076',
        'sv076@student.ptit.edu.vn',
        '0911000076',
        3
    ),
    (
        'sv077',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 077',
        'sv077@student.ptit.edu.vn',
        '0911000077',
        3
    ),
    (
        'sv078',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 078',
        'sv078@student.ptit.edu.vn',
        '0911000078',
        3
    ),
    (
        'sv079',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 079',
        'sv079@student.ptit.edu.vn',
        '0911000079',
        3
    ),
    (
        'sv080',
        '$2b$10$kWykW3D/cWJYsipHRM5eQeXKnW3f4HkFuOSmXOUCM/dRsk/3UCDAi',
        'Sinh viên 080',
        'sv080@student.ptit.edu.vn',
        '0911000080',
        3
    );
-- 2.2. Classes (2 classes)
INSERT INTO Classes (class_code, class_name, major)
VALUES (
        'D22PTDPT1',
        'Lớp Công nghệ đa phương tiện D22PTDPT1',
        'Công nghệ đa phương tiện'
    ),
    (
        'D22PTDPT2',
        'Lớp Công nghệ đa phương tiện D22PTDPT2',
        'Công nghệ đa phương tiện'
    );
-- 2.3. Lecturers (3 lecturers)
INSERT INTO Lecturers (user_id, lecturer_code, department, position)
SELECT user_id,
    'GV001',
    'Khoa Công nghệ Thông tin',
    'Giảng viên'
FROM Users
WHERE username = 'gv001'
UNION ALL
SELECT user_id,
    'GV002',
    'Khoa Công nghệ Thông tin',
    'Giảng viên chính'
FROM Users
WHERE username = 'gv002'
UNION ALL
SELECT user_id,
    'GV003',
    'Khoa Toán - Tin học',
    'Phó Giáo sư'
FROM Users
WHERE username = 'gv003';
-- 2.4. Students (80 students: 40 in class 1, 40 in class 2)
SET @class1 = (
        SELECT class_id
        FROM Classes
        WHERE class_code = 'D22PTDPT1'
    );
SET @class2 = (
        SELECT class_id
        FROM Classes
        WHERE class_code = 'D22PTDPT2'
    );
-- First 40 students -> Class 1
INSERT INTO Students (
        user_id,
        student_code,
        date_of_birth,
        address,
        class_id
    )
SELECT u.user_id,
    CONCAT(
        'B22DCCN',
        LPAD(SUBSTRING(u.username, 3), 3, '0')
    ),
    DATE_SUB(
        CURDATE(),
        INTERVAL (
            18 + (CAST(SUBSTRING(u.username, 3) AS UNSIGNED) % 5)
        ) YEAR
    ),
    CASE
        (CAST(SUBSTRING(u.username, 3) AS UNSIGNED) % 3)
        WHEN 0 THEN 'Hà Nội'
        WHEN 1 THEN 'TP.HCM'
        ELSE 'Đà Nẵng'
    END,
    @class1
FROM Users u
WHERE u.username REGEXP '^sv0(0[1-9]|[1-3][0-9]|40)$';
-- Last 40 students -> Class 2
INSERT INTO Students (
        user_id,
        student_code,
        date_of_birth,
        address,
        class_id
    )
SELECT u.user_id,
    CONCAT(
        'B22DCCN',
        LPAD(SUBSTRING(u.username, 3), 3, '0')
    ),
    DATE_SUB(
        CURDATE(),
        INTERVAL (
            18 + (CAST(SUBSTRING(u.username, 3) AS UNSIGNED) % 5)
        ) YEAR
    ),
    CASE
        (CAST(SUBSTRING(u.username, 3) AS UNSIGNED) % 3)
        WHEN 0 THEN 'Hà Nội'
        WHEN 1 THEN 'TP.HCM'
        ELSE 'Đà Nẵng'
    END,
    @class2
FROM Users u
WHERE u.username REGEXP '^sv0(4[1-9]|[5-7][0-9]|80)$';
-- 2.5. Subjects (3 subjects)
INSERT INTO Subjects (subject_code, subject_name, credits)
VALUES ('MUL2013', 'Xử lý ảnh', 3),
    ('MUL2023', 'Lập trình game cơ bản', 3),
    ('MUL3033', 'Lập trình web', 4);
-- 2.6. Lecturer_Subjects (Giảng viên có khả năng dạy môn gì)
INSERT INTO Lecturer_Subjects (lecturer_id, subject_id)
SELECT l.lecturer_id,
    s.subject_id
FROM Lecturers l
    CROSS JOIN Subjects s
WHERE (
        l.lecturer_code = 'GV001'
        AND s.subject_code = 'MUL2013'
    )
    OR (
        l.lecturer_code = 'GV002'
        AND s.subject_code = 'MUL2023'
    )
    OR (
        l.lecturer_code = 'GV003'
        AND s.subject_code = 'MUL3033'
    );
-- 2.7. Lecturer_Assignments (Phân công giảng dạy thực tế)
INSERT INTO Lecturer_Assignments (lecturer_id, subject_id, class_id, semester)
SELECT l.lecturer_id,
    s.subject_id,
    c.class_id,
    '20242'
FROM Lecturers l
    CROSS JOIN Subjects s
    CROSS JOIN Classes c
WHERE (
        l.lecturer_code = 'GV001'
        AND s.subject_code = 'MUL2013'
    )
    OR (
        l.lecturer_code = 'GV002'
        AND s.subject_code = 'MUL2023'
    )
    OR (
        l.lecturer_code = 'GV003'
        AND s.subject_code = 'MUL3033'
    );
-- 2.8. Grades (240 records: 80 students x 3 subjects)
INSERT INTO Grades (
        student_id,
        subject_id,
        semester,
        attendance_score,
        practice_score,
        midterm_score,
        final_score
    )
SELECT st.student_id,
    sub.subject_id,
    '20242',
    ROUND(7 + RAND() * 3, 1),
    -- 7.0-10.0
    ROUND(6 + RAND() * 4, 1),
    -- 6.0-10.0
    ROUND(5 + RAND() * 5, 1),
    -- 5.0-10.0
    ROUND(5 + RAND() * 5, 1) -- 5.0-10.0
FROM Students st
    CROSS JOIN Subjects sub;
-- 2.9. Course_Materials (12 materials: 4 per subject)
INSERT INTO Course_Materials (
        subject_id,
        title,
        url,
        file_type,
        added_by_user_id
    )
VALUES -- MUL2013 (Xử lý ảnh)
    (
        (
            SELECT subject_id
            FROM Subjects
            WHERE subject_code = 'MUL2013'
        ),
        'Bài giảng Xử lý ảnh - Chương 1',
        '/uploads/mul2013_ch1.pdf',
        'pdf',
        (
            SELECT user_id
            FROM Users
            WHERE username = 'gv001'
        )
    ),
    (
        (
            SELECT subject_id
            FROM Subjects
            WHERE subject_code = 'MUL2013'
        ),
        'Mô hình 3D ví dụ',
        '/uploads/sample_model.glb',
        '3d_model',
        (
            SELECT user_id
            FROM Users
            WHERE username = 'gv001'
        )
    ),
    (
        (
            SELECT subject_id
            FROM Subjects
            WHERE subject_code = 'MUL2013'
        ),
        'Hình ảnh mẫu',
        '/uploads/sample_image.jpg',
        'image',
        (
            SELECT user_id
            FROM Users
            WHERE username = 'gv001'
        )
    ),
    (
        (
            SELECT subject_id
            FROM Subjects
            WHERE subject_code = 'MUL2013'
        ),
        'Bài tập về nhà',
        '/uploads/homework.zip',
        'archive',
        (
            SELECT user_id
            FROM Users
            WHERE username = 'gv001'
        )
    ),
    -- MUL2023 (Game)
    (
        (
            SELECT subject_id
            FROM Subjects
            WHERE subject_code = 'MUL2023'
        ),
        'Bài giảng Game - Chương 1',
        '/uploads/mul2023_ch1.pdf',
        'pdf',
        (
            SELECT user_id
            FROM Users
            WHERE username = 'gv002'
        )
    ),
    (
        (
            SELECT subject_id
            FROM Subjects
            WHERE subject_code = 'MUL2023'
        ),
        'Source code game mẫu',
        '/uploads/game_source.zip',
        'archive',
        (
            SELECT user_id
            FROM Users
            WHERE username = 'gv002'
        )
    ),
    (
        (
            SELECT subject_id
            FROM Subjects
            WHERE subject_code = 'MUL2023'
        ),
        'Tài liệu Unity',
        '/uploads/unity_guide.pdf',
        'pdf',
        (
            SELECT user_id
            FROM Users
            WHERE username = 'gv002'
        )
    ),
    (
        (
            SELECT subject_id
            FROM Subjects
            WHERE subject_code = 'MUL2023'
        ),
        'Asset 3D cho game',
        '/uploads/game_asset.glb',
        '3d_model',
        (
            SELECT user_id
            FROM Users
            WHERE username = 'gv002'
        )
    ),
    -- MUL3033 (Web)
    (
        (
            SELECT subject_id
            FROM Subjects
            WHERE subject_code = 'MUL3033'
        ),
        'Bài giảng Web - HTML/CSS',
        '/uploads/mul3033_ch1.pdf',
        'pdf',
        (
            SELECT user_id
            FROM Users
            WHERE username = 'gv003'
        )
    ),
    (
        (
            SELECT subject_id
            FROM Subjects
            WHERE subject_code = 'MUL3033'
        ),
        'Bài giảng Web - JavaScript',
        '/uploads/mul3033_ch2.pdf',
        'pdf',
        (
            SELECT user_id
            FROM Users
            WHERE username = 'gv003'
        )
    ),
    (
        (
            SELECT subject_id
            FROM Subjects
            WHERE subject_code = 'MUL3033'
        ),
        'Template website',
        '/uploads/web_template.zip',
        'archive',
        (
            SELECT user_id
            FROM Users
            WHERE username = 'gv003'
        )
    ),
    (
        (
            SELECT subject_id
            FROM Subjects
            WHERE subject_code = 'MUL3033'
        ),
        'Ảnh minh họa',
        '/uploads/web_demo.png',
        'image',
        (
            SELECT user_id
            FROM Users
            WHERE username = 'gv003'
        )
    );
-- 2.10. Tickets (3 tickets)
INSERT INTO Tickets (
        student_id,
        subject_id,
        lecturer_id,
        message_text,
        response_text,
        response_at,
        status
    )
VALUES (
        (
            SELECT student_id
            FROM Students
            WHERE student_code = 'B22DCCN001'
        ),
        (
            SELECT subject_id
            FROM Subjects
            WHERE subject_code = 'MUL2013'
        ),
        (
            SELECT lecturer_id
            FROM Lecturers
            WHERE lecturer_code = 'GV001'
        ),
        'Em chào thầy! Em có thắc mắc về bài tập chương 1 ạ.',
        'Chào em! Thầy đã gửi hướng dẫn chi tiết qua email rồi nhé.',
        NOW(),
        'answered'
    ),
    (
        (
            SELECT student_id
            FROM Students
            WHERE student_code = 'B22DCCN002'
        ),
        (
            SELECT subject_id
            FROM Subjects
            WHERE subject_code = 'MUL2023'
        ),
        (
            SELECT lecturer_id
            FROM Lecturers
            WHERE lecturer_code = 'GV002'
        ),
        'Thầy ơi, em không tìm thấy file source code game mẫu ạ!',
        NULL,
        NULL,
        'pending'
    ),
    (
        (
            SELECT student_id
            FROM Students
            WHERE student_code = 'B22DCCN041'
        ),
        (
            SELECT subject_id
            FROM Subjects
            WHERE subject_code = 'MUL3033'
        ),
        (
            SELECT lecturer_id
            FROM Lecturers
            WHERE lecturer_code = 'GV003'
        ),
        'Thầy cho em hỏi về cách deploy web lên hosting được không ạ?',
        'OK em, thầy sẽ làm buổi hướng dẫn riêng về phần này.',
        NOW(),
        'answered'
    );
-- 2.11. Chatbot_Logs (Sample)
INSERT INTO Chatbot_Logs (
        student_id,
        subject_id,
        question,
        answer,
        confidence
    )
VALUES (
        (
            SELECT student_id
            FROM Students
            WHERE student_code = 'B22DCCN001'
        ),
        (
            SELECT subject_id
            FROM Subjects
            WHERE subject_code = 'MUL2013'
        ),
        'Xử lý ảnh là gì?',
        'Xử lý ảnh là một lĩnh vực của khoa học máy tính liên quan đến việc phân tích, xử lý và thay đổi hình ảnh số.',
        'high'
    ),
    (
        (
            SELECT student_id
            FROM Students
            WHERE student_code = 'B22DCCN002'
        ),
        (
            SELECT subject_id
            FROM Subjects
            WHERE subject_code = 'MUL2023'
        ),
        'Unity có miễn phí không?',
        'Unity có phiên bản miễn phí cho sinh viên và dự án nhỏ. Bạn có thể tải về từ trang chủ unity.com',
        'high'
    );
-- =============================================================================
-- HOÀN TẤT!
-- =============================================================================
-- Hướng dẫn import:
-- 1. Mở MySQL Workbench hoặc cmd
-- 2. Chạy lệnh: SOURCE /path/to/init.sql;
-- 3. Hoặc: mysql -u root -p qlsv < init.sql
-- =============================================================================