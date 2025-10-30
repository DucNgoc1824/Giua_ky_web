# 🤖 HƯỚNG DẪN SETUP AI CHATBOT

## ✅ ĐÃ HOÀN THÀNH:

### Backend:

-   ✅ Cài đặt @google/generative-ai
-   ✅ Tạo chatbotController.js
-   ✅ Tạo chatbotRoutes.js
-   ✅ Thêm route vào server.js
-   ✅ Tạo migration create_chatbot_logs.sql

### Frontend:

-   ✅ Tạo ChatWidget.jsx component
-   ✅ Tạo ChatWidget.css
-   ✅ Tạo chatbotService.js
-   ✅ Thêm ChatWidget vào TicketInboxPage

---

## 🚀 CÁC BƯỚC SETUP (3 phút):

### Bước 1: Lấy Gemini API Key (MIỄN PHÍ)

1. Vào: https://aistudio.google.com/app/apikey
2. Đăng nhập Google
3. Click "Create API Key"
4. Copy API key

### Bước 2: Thêm API Key vào .env

Mở file `back-end/.env` và thêm dòng:

```env
GEMINI_API_KEY=AIzaSy...your_key_here
```

### Bước 3: Tạo bảng Chatbot_Logs

Chạy lệnh:

```powershell
Get-Content back-end\database\create_chatbot_logs.sql | mysql -u root -p qlsv
```

Hoặc copy SQL từ file `back-end/database/create_chatbot_logs.sql` và chạy trong MySQL Workbench.

### Bước 4: Restart Backend

```bash
cd back-end
npm start
```

### Bước 5: Restart Frontend (nếu đang chạy)

```bash
cd front-end
npm run dev
```

---

## 🎯 CÁCH SỬ DỤNG:

### Cho Sinh Viên:

1. Vào trang **"Hỏi đáp/Góp ý"**
2. Chọn **Môn học** từ dropdown khi tạo ticket
3. Nút chatbot **🤖** sẽ xuất hiện ở góc dưới bên phải
4. Click vào để chat với AI

### Tính năng:

-   ✅ AI trả lời dựa trên:
    -   Lịch sử tickets đã được giảng viên trả lời
    -   Danh sách bài tập (tiêu đề, mô tả, hạn nộp)
    -   Tài liệu học tập
-   ✅ Nếu AI không trả lời được:

    -   Hiện nút **"Gửi ticket cho giảng viên"**
    -   Auto-fill câu hỏi vào form tạo ticket

-   ✅ Lịch sử chat được lưu trong database

---

## 📊 DEMO QUESTIONS:

Thử hỏi chatbot:

-   "Hạn nộp bài tập 1 là khi nào?"
-   "Môn học này có bao nhiêu bài tập?"
-   "Tài liệu môn học ở đâu?"
-   "Điểm giữa kỳ chiếm bao nhiêu phần trăm?"

---

## 🔧 TROUBLESHOOTING:

### Lỗi: "API key not valid"

-   Kiểm tra GEMINI_API_KEY trong .env
-   Đảm bảo không có khoảng trắng thừa

### Lỗi: "Table 'qlsv.Chatbot_Logs' doesn't exist"

-   Chạy migration: `create_chatbot_logs.sql`

### Chatbot không xuất hiện

-   Đảm bảo user là **Sinh viên** (roleId = 3)
-   Đảm bảo đã **chọn môn học** trong dropdown

### Lỗi CORS

-   Kiểm tra FRONTEND_URL trong .env = http://localhost:5173

---

## 💰 CHI PHÍ:

-   **MIỄN PHÍ 100%** với Gemini API
-   Giới hạn: 60 requests/phút (đủ dùng!)

---

## 🎉 HOÀN TẤT!

Chatbot đã sẵn sàng! Vào trang Hỏi đáp và thử ngay! 🚀
