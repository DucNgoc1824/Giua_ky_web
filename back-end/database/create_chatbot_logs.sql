-- Migration: Tạo bảng Chatbot_Logs để tracking conversations
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