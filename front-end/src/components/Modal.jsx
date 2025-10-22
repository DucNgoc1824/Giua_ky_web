import React from 'react';
import '../assets/Modal.css'; // Import CSS

/*
 * Component Modal đa năng
 * Props:
 * - isOpen: (boolean) Hiển thị modal hay không
 * - onClose: (function) Hàm để đóng modal
 * - title: (string) Tiêu đề của modal
 * - children: (JSX) Nội dung bên trong (thường là cái form)
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  // Nếu không 'isOpen', không render gì cả
  if (!isOpen) {
    return null;
  }

  // Ngăn chặn việc click vào form cũng đóng modal
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Lớp mờ nền
    // Click vào nền sẽ đóng modal (gọi onClose)
    <div className="modal-backdrop" onClick={onClose}>
      {/* Nội dung modal */}
      <div className="modal-content" onClick={handleContentClick}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close-btn">
            &times; {/* Dấu 'x' */}
          </button>
        </div>

        {/* 'children' sẽ là cái form ta truyền vào */}
        {children} 

      </div>
    </div>
  );
};

export default Modal;