CREATE DATABASE IF NOT EXISTS qlsv CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qlsv;
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
-- 8. Lecturer_Subjects (capability)
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
-- 9. Lecturer_Assignments (actual assignments)
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
-- 10. Course_Materials
CREATE TABLE IF NOT EXISTS Course_Materials (
    material_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    class_id INT,
    title VARCHAR(255) NOT NULL,
    url TEXT,
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
-- 11. Tickets
CREATE TABLE IF NOT EXISTS Tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    lecturer_id INT DEFAULT NULL,
    message_text TEXT NOT NULL,
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