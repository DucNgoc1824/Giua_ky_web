# Database Setup Guide

## Cách 1: Import trực tiếp từ command line

```bash
mysql -u root -p < schema.sql
```

## Cách 2: Sử dụng MySQL Workbench

1. Mở MySQL Workbench
2. Kết nối tới MySQL server
3. File → Open SQL Script
4. Chọn file `schema.sql`
5. Click nút Execute (⚡)

## Cách 3: Sử dụng phpMyAdmin

1. Mở phpMyAdmin
2. Click tab "SQL"
3. Click "Choose File" và chọn `schema.sql`
4. Click "Go"

## Kiểm tra sau khi import

```sql
USE qlsv;
SHOW TABLES;
```

Bạn sẽ thấy 10 bảng:

-   Users
-   Students
-   Lecturers
-   Classes
-   Subjects
-   Grades
-   Lecturer_Subjects
-   Lecturer_Assignments
-   Course_Materials
-   Tickets

## Tạo dữ liệu mẫu

Sau khi import schema, chạy các script trong thư mục `../scripts/`:

```bash
cd ..
node scripts/checkUsers.js
node scripts/assignLecturerSubjects.js
node scripts/createSampleAssignments.js
```
