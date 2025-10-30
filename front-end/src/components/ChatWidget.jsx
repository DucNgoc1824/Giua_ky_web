import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaTicketAlt, FaBook } from 'react-icons/fa';
import Select from 'react-select';
import chatbotService from '../services/chatbotService';
import subjectService from '../services/subjectService';
import { toast } from 'react-toastify';
import '../assets/ChatWidget.css';

const ChatWidget = ({ onCreateTicket }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    
    // Quản lý môn học
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load subjects khi component mount
    useEffect(() => {
        const fetchSubjects = async () => {
            setIsLoadingSubjects(true);
            try {
                const data = await subjectService.getAllSubjects();
                setSubjects(data);
                // Auto-select môn đầu tiên
                if (data.length > 0) {
                    setSelectedSubject(data[0]);
                }
            } catch (error) {
                console.error('Không thể tải môn học:', error);
                toast.error('Không thể tải danh sách môn học');
            } finally {
                setIsLoadingSubjects(false);
            }
        };
        fetchSubjects();
    }, []);

    // Welcome message khi mở chat hoặc đổi môn
    useEffect(() => {
        if (isOpen && messages.length === 0 && selectedSubject) {
            setMessages([{
                role: 'ai',
                text: `Xin chào! 👋 Tôi là trợ lý ảo của môn **${selectedSubject.subject_name}**.\n\nBạn có thể hỏi tôi về:\n- Hạn nộp bài tập\n- Nội dung môn học\n- Tài liệu tham khảo\n- Các câu hỏi thường gặp\n\nBạn có câu hỏi gì không?`,
                timestamp: new Date()
            }]);
        }
    }, [isOpen, selectedSubject]);

    // Reset messages khi đổi môn
    const handleSubjectChange = (selectedOption) => {
        setSelectedSubject(selectedOption);
        setMessages([]); // Clear chat history
    };

    // Format data cho react-select
    const subjectOptions = subjects.map(subject => ({
        value: subject.subject_id,
        label: subject.subject_name,
        ...subject
    }));

    // Custom styles cho react-select
    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(255, 255, 255, 0.3)' : 'none',
            cursor: 'pointer',
            minHeight: '36px',
            '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
            }
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'white',
            fontSize: '13px',
            fontWeight: '500',
        }),
        input: (provided) => ({
            ...provided,
            color: 'white',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '13px',
        }),
        menu: (provided) => ({
            ...provided,
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
        }),
        menuList: (provided) => ({
            ...provided,
            padding: '8px',
        }),
        option: (provided, state) => ({
            ...provided,
            background: state.isSelected 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : state.isFocused 
                ? 'rgba(102, 126, 234, 0.1)' 
                : 'transparent',
            color: state.isSelected ? 'white' : '#333',
            padding: '10px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: state.isSelected ? '600' : '500',
            marginBottom: '4px',
            transition: 'all 0.2s ease',
            '&:hover': {
                background: state.isSelected 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'rgba(102, 126, 234, 0.15)',
            }
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
                color: 'white',
            }
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        if (!selectedSubject) {
            toast.warning('Vui lòng chọn môn học trước');
            return;
        }

        const userMessage = {
            role: 'user',
            text: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatbotService.askQuestion(input.trim(), selectedSubject.value || selectedSubject.subject_id);

            const aiMessage = {
                role: 'ai',
                text: response.answer,
                confidence: response.confidence,
                shouldCreateTicket: response.shouldCreateTicket,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error('Chatbot error:', error);
            
            const errorMessage = {
                role: 'ai',
                text: 'Xin lỗi, tôi gặp vấn đề khi xử lý câu hỏi của bạn. Bạn có thể thử lại hoặc gửi ticket cho giảng viên.',
                confidence: 'low',
                shouldCreateTicket: true,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleCreateTicketFromChat = (messageText) => {
        if (onCreateTicket) {
            onCreateTicket(messageText);
            setIsOpen(false);
            toast.info('Đã chuyển sang form tạo ticket');
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                className={`chat-widget-button ${isOpen ? 'hidden' : ''}`}
                onClick={() => setIsOpen(true)}
                title="Trò chuyện với AI"
            >
                <FaRobot size={24} />
                <span className="pulse-ring"></span>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-widget-container">
                    {/* Header */}
                    <div className="chat-widget-header">
                        <div className="chat-header-left">
                            <div className="chat-header-info">
                                <FaRobot size={20} />
                                <div>
                                    <h4>Trợ lý AI</h4>
                                    <span className="chat-status">
                                        <span className="status-dot"></span>
                                        Đang hoạt động
                                    </span>
                                </div>
                            </div>
                            
                            {/* Subject Selector */}
                            <div className="subject-selector">
                                <FaBook size={14} />
                                <Select
                                    value={selectedSubject ? {
                                        value: selectedSubject.subject_id,
                                        label: selectedSubject.subject_name
                                    } : null}
                                    onChange={handleSubjectChange}
                                    options={subjectOptions}
                                    styles={customSelectStyles}
                                    isLoading={isLoadingSubjects}
                                    isDisabled={isLoadingSubjects || subjects.length === 0}
                                    placeholder={isLoadingSubjects ? "Đang tải..." : "Chọn môn học"}
                                    noOptionsMessage={() => "Không có môn học"}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>
                        <button
                            className="chat-close-btn"
                            onClick={() => setIsOpen(false)}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chat-widget-messages">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`chat-message ${message.role}`}
                            >
                                {message.role === 'ai' && (
                                    <div className="message-avatar">
                                        <FaRobot />
                                    </div>
                                )}
                                <div className="message-content">
                                    <p>{message.text}</p>
                                    {message.shouldCreateTicket && message.role === 'ai' && (
                                        <button
                                            className="create-ticket-btn"
                                            onClick={() => handleCreateTicketFromChat(messages[index - 1]?.text || '')}
                                        >
                                            <FaTicketAlt /> Gửi ticket cho giảng viên
                                        </button>
                                    )}
                                    <span className="message-time">
                                        {message.timestamp.toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="chat-message ai">
                                <div className="message-avatar">
                                    <FaRobot />
                                </div>
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chat-widget-input">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập câu hỏi của bạn..."
                            rows="1"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="send-btn"
                        >
                            <FaPaperPlane />
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="chat-widget-footer">
                        <small>🤖 Powered by Gemini AI</small>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
