const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../config/db');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

exports.askQuestion = async (req, res) => {
    try {
        const { question, subject_id } = req.body;
        const student_id = req.user.studentId;

        if (!question || !question.trim()) {
            return res.status(400).json({ message: 'Câu hỏi không được để trống' });
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

        if (tickets.length > 0) {
            context += '## Lịch sử Hỏi Đáp:\n';
            tickets.forEach((t, i) => {
                context += `\n${i + 1}. Câu hỏi: ${t.message_text}\n   Trả lời: ${t.response_text}\n`;
            });
        }

        if (assignments.length > 0) {
            context += '\n## Danh sách Bài tập:\n';
            assignments.forEach((a, i) => {
                const dueDate = new Date(a.due_date).toLocaleDateString('vi-VN');
                context += `\n${i + 1}. ${a.title}\n   Mô tả: ${a.description}\n   Hạn nộp: ${dueDate}\n`;
            });
        }

        if (materials.length > 0) {
            context += '\n## Tài liệu học tập:\n';
            materials.forEach((m, i) => {
                context += `${i + 1}. ${m.title}\n`;
            });
        }

        // 5. Gọi Gemini API
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

CÂU HỎI CỦA SINH VIÊN:
${question}

TRẢ LỜI:`;

        const result = await model.generateContent(prompt);
        const answer = result.response.text();

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
            shouldCreateTicket: confidence === 'low'
        });

    } catch (error) {
        console.error('❌ Chatbot Error:', error);

        // Nếu lỗi API key hoặc quota
        if (error.message?.includes('API key') || error.message?.includes('quota')) {
            return res.status(503).json({
                success: false,
                message: 'Chatbot tạm thời không khả dụng. Vui lòng gửi ticket trực tiếp cho giảng viên.',
                error: 'API_ERROR'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi xử lý câu hỏi',
            error: error.message
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
