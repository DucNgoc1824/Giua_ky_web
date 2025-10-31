const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../config/db');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Fallback responses khi AI không khả dụng - với format đẹp
const getFallbackAnswer = (question) => {
    const q = question.toLowerCase().trim();
    
    // Câu hỏi về điểm
    if (q.includes('điểm') || q.includes('xem điểm')) {
        return `### 📊 Cách xem điểm số

Để xem điểm số của bạn, hãy làm theo các bước sau:

**Bước 1:** Vào menu **"Điểm"** ở thanh menu bên trái  
**Bước 2:** Chọn **môn học** bạn muốn xem  
**Bước 3:** Xem chi tiết các thành phần điểm:
- ✅ Chuyên cần (10%)
- ✅ Giữa kỳ (30%)
- ✅ Cuối kỳ (60%)
- ✅ Điểm trung bình

💡 **Lưu ý:** Nếu thấy điểm chưa chính xác, bạn có thể gửi **ticket** cho giảng viên để phản ánh.`;
    }
    
    // Câu hỏi về bài tập
    if (q.includes('bài tập') || q.includes('assignment') || q.includes('nộp bài')) {
        return `### 📝 Hướng dẫn quản lý bài tập

**Các bước thực hiện:**

1️⃣ **Xem bài tập:** Vào menu **"Bài tập"** để xem danh sách  
2️⃣ **Nộp bài:** Click vào bài tập → **"Nộp bài"** → Upload file  
3️⃣ **Kiểm tra deadline:** Chú ý hạn nộp để không bị trễ

⚠️ **Quan trọng:** Nộp đúng định dạng file và trước deadline!

💬 Nếu cần hỗ trợ, hãy gửi **ticket** cho giảng viên.`;
    }
    
    // Câu hỏi về tài liệu
    if (q.includes('tài liệu') || q.includes('material') || q.includes('học liệu')) {
        return `### 📚 Truy cập tài liệu học tập

**Hướng dẫn chi tiết:**

1️⃣ Vào menu **"Tài liệu"** hoặc **"Course Materials"**  
2️⃣ Chọn **môn học** bạn đang theo học  
3️⃣ Tải về tài liệu hoặc xem trực tiếp:
   - 📄 PDF, PPT, Word
   - 🎨 3D Model (xem trực tiếp trên trình duyệt)

🔄 **Cập nhật thường xuyên** - Kiểm tra định kỳ để không bỏ lỡ tài liệu mới!`;
    }
    
    // Câu hỏi về liên hệ giảng viên
    if (q.includes('liên hệ') || q.includes('hỏi giảng viên') || q.includes('ticket')) {
        return `### 💬 Liên hệ với giảng viên

**Cách tạo Ticket:**

1️⃣ Vào **"Hộp thư"** hoặc **"Ticket Inbox"**  
2️⃣ Click **"Gửi thắc mắc mới"** (nút đỏ)  
3️⃣ Chọn **môn học** và nhập câu hỏi chi tiết  
4️⃣ **Gửi** - Giảng viên sẽ trả lời trong **24-48 giờ**

✨ **Mẹo:** Viết rõ ràng, đầy đủ thông tin để được hỗ trợ nhanh hơn!`;
    }
    
    // Câu hỏi chung
    return `### 🤖 Xin chào! Tôi là trợ lý ảo PTIT

Tôi có thể giúp bạn với các chức năng sau:

📊 **Xem điểm số** - Tra cứu điểm các môn học  
📝 **Quản lý bài tập** - Xem và nộp bài tập  
📚 **Tài liệu môn học** - Tải về hoặc xem 3D model  
💬 **Liên hệ giảng viên** - Gửi ticket hỗ trợ

---

❓ **Hãy hỏi tôi bất kỳ câu hỏi nào!** Ví dụ:
- "Làm sao để xem điểm?"
- "Hạn nộp bài tập là khi nào?"
- "Tải tài liệu ở đâu?"`;
};

exports.askQuestion = async (req, res) => {
    try {
        const { question, subject_id } = req.body;
        const student_id = req.user.studentId;

        if (!question || !question.trim()) {
            return res.status(400).json({ 
                success: false,
                message: 'Câu hỏi không được để trống' 
            });
        }

        // Kiểm tra Gemini API Key
        if (!process.env.GEMINI_API_KEY) {
            console.error('❌ GEMINI_API_KEY not found in .env');
            return res.json({
                success: true,
                answer: getFallbackAnswer(question),
                confidence: 'medium',
                shouldCreateTicket: true,
                note: 'Chatbot đang sử dụng fallback response do API key không có sẵn.'
            });
        }

        // 1. Tìm lịch sử tickets đã được trả lời của môn học
        const [tickets] = await db.query(`
            SELECT t.message_text, t.response_text, s.subject_name
            FROM Tickets t
            JOIN Subjects s ON t.subject_id = s.subject_id
            WHERE t.status = 'Đã phản hồi' 
            AND t.subject_id = ?
            AND t.response_text IS NOT NULL
            ORDER BY t.updated_at DESC
            LIMIT 15
        `, [subject_id]);

        // 2. Tìm thông tin bài tập của môn học
        const [assignments] = await db.query(`
            SELECT title, description, due_date
            FROM Assignments
            WHERE subject_id = ?
            ORDER BY due_date DESC
            LIMIT 10
        `, [subject_id]);

        // 3. Tìm tài liệu môn học
        const [materials] = await db.query(`
            SELECT title, url
            FROM Course_Materials
            WHERE subject_id = ?
            LIMIT 5
        `, [subject_id]);

        // 4. Build context từ dữ liệu
        let context = '';

        // Thêm thông tin cơ bản về hệ thống
        context += `## THÔNG TIN HỆ THỐNG QUẢN LÝ SINH VIÊN PTIT

**Các chức năng chính:**
1. **Xem điểm số**: 
   - Đăng nhập vào hệ thống
   - Vào menu "Điểm" hoặc "Quản lý điểm"
   - Chọn môn học để xem điểm chi tiết (Chuyên cần, Giữa kỳ, Cuối kỳ)

2. **Xem bài tập**: 
   - Vào menu "Bài tập" hoặc "Assignments"
   - Xem danh sách bài tập theo môn học
   - Nộp bài trực tiếp trên hệ thống

3. **Xem tài liệu học tập**:
   - Vào menu "Tài liệu" hoặc "Course Materials"
   - Chọn môn học
   - Tải về tài liệu PDF hoặc xem 3D model

4. **Liên hệ giảng viên**:
   - Vào "Hộp thư Ticket" hoặc "Ticket Inbox"
   - Tạo ticket mới với nội dung câu hỏi
   - Giảng viên sẽ trả lời trong vòng 24-48h

5. **Xem thông tin cá nhân**:
   - Vào "Hồ sơ" hoặc "Profile"
   - Xem và cập nhật thông tin

`;

        if (tickets.length > 0) {
            context += '\n## Lịch sử Hỏi Đáp từ Tickets:\n';
            tickets.forEach((t, i) => {
                context += `\n${i + 1}. Câu hỏi: ${t.message_text}\n   Trả lời: ${t.response_text}\n`;
            });
        }

        if (assignments.length > 0) {
            context += '\n## Danh sách Bài tập hiện tại:\n';
            assignments.forEach((a, i) => {
                const dueDate = new Date(a.due_date).toLocaleDateString('vi-VN');
                context += `\n${i + 1}. ${a.title}\n   Mô tả: ${a.description}\n   Hạn nộp: ${dueDate}\n`;
            });
        } else {
            context += '\n## Bài tập:\nHiện chưa có bài tập nào được giao. Sinh viên có thể kiểm tra lại sau.\n';
        }

        if (materials.length > 0) {
            context += '\n## Tài liệu học tập:\n';
            materials.forEach((m, i) => {
                context += `${i + 1}. ${m.title}\n`;
            });
        } else {
            context += '\n## Tài liệu:\nGiảng viên chưa upload tài liệu. Sinh viên có thể gửi ticket để yêu cầu.\n';
        }

        // 5. Gọi Gemini API
        let answer;
        let usingFallback = false;

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            const prompt = `Bạn là trợ lý ảo hỗ trợ sinh viên tại Học viện Công nghệ Bưu chính Viễn thông (PTIT).

NHIỆM VỤ: Trả lời câu hỏi của sinh viên dựa trên dữ liệu có sẵn dưới đây.

${context}

---

QUY TẮC:
1. Ưu tiên trích dẫn từ "Lịch sử Hỏi Đáp" nếu có câu hỏi tương tự
2. Cung cấp thông tin chính xác về hạn nộp bài tập, nội dung môn học
3. Nếu không tìm thấy thông tin, PHẢI trả lời: "Tôi chưa có đủ thông tin để trả lời câu hỏi này. Bạn nên gửi ticket cho giảng viên để được hỗ trợ trực tiếp."
4. Trả lời ngắn gọn, rõ ràng bằng tiếng Việt
5. Lịch sự, thân thiện
6. **FORMAT BẮT BUỘC**: Sử dụng Markdown để format câu trả lời:
   - Dùng **### Tiêu đề** cho phần đầu
   - Dùng **bold** cho từ khóa quan trọng
   - Dùng emoji phù hợp (📊📝📚💬✅⚠️💡)
   - Dùng số thứ tự (1️⃣ 2️⃣ 3️⃣) hoặc bullet points
   - Tạo spacing rõ ràng giữa các phần

CÂU HỎI CỦA SINH VIÊN:
${question}

TRẢ LỜI (với Markdown format):`;

            const result = await model.generateContent(prompt);
            answer = result.response.text();

        } catch (geminiError) {
            console.error('❌ Gemini API Error:', geminiError.message);
            
            // Fallback nếu Gemini lỗi
            answer = getFallbackAnswer(question);
            usingFallback = true;
        }

        // 6. Xác định độ tin cậy
        const confidence = answer.toLowerCase().includes('chưa có đủ thông tin') ||
            answer.toLowerCase().includes('không tìm thấy') ||
            answer.toLowerCase().includes('gửi ticket')
            ? 'low'
            : 'high';

        // 7. Log conversation (optional - để tracking)
        await db.query(`
            INSERT INTO Chatbot_Logs (student_id, subject_id, question, answer, confidence, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        `, [student_id, subject_id, question, answer, confidence]);

        res.json({
            success: true,
            answer,
            confidence,
            shouldCreateTicket: confidence === 'low',
            usingFallback
        });

    } catch (error) {
        console.error('❌ Chatbot Error:', error);
        console.error('Error stack:', error.stack);

        // Trả về fallback response thay vì lỗi
        res.json({
            success: true,
            answer: getFallbackAnswer(req.body.question || ''),
            confidence: 'low',
            shouldCreateTicket: true,
            usingFallback: true,
            note: 'Chatbot đang gặp sự cố. Bạn nên gửi ticket cho giảng viên.'
        });
    }
};

// Lấy lịch sử chat của sinh viên
exports.getChatHistory = async (req, res) => {
    try {
        const student_id = req.user.studentId;
        const { subject_id } = req.query;

        let query = `
            SELECT question, answer, confidence, created_at
            FROM Chatbot_Logs
            WHERE student_id = ?
        `;
        const params = [student_id];

        if (subject_id) {
            query += ' AND subject_id = ?';
            params.push(subject_id);
        }

        query += ' ORDER BY created_at DESC LIMIT 20';

        const [logs] = await db.query(query, params);

        res.json({
            success: true,
            history: logs
        });

    } catch (error) {
        console.error('❌ Get Chat History Error:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể lấy lịch sử chat'
        });
    }
};
