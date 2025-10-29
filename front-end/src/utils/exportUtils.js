import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Export to Excel
export const exportToExcel = (data, filename = 'export') => {
  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    return true;
  } catch (error) {
    console.error('Export to Excel failed:', error);
    return false;
  }
};

// Export to PDF
export const exportToPDF = (title, headers, data, filename = 'export') => {
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`, 14, 25);
    
    // Add table
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
      styles: {
        font: 'helvetica',
        fontSize: 10,
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255,
        fontStyle: 'bold',
      },
    });
    
    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
    return true;
  } catch (error) {
    console.error('Export to PDF failed:', error);
    return false;
  }
};

// Print transcript (for student grades)
export const printTranscript = (studentInfo, grades) => {
  try {
    const printWindow = window.open('', '', 'width=800,height=600');
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bảng điểm - ${studentInfo.studentCode}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            color: #2196F3;
          }
          .student-info {
            margin-bottom: 20px;
          }
          .student-info p {
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #2196F3;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .footer {
            margin-top: 30px;
            text-align: right;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BẢNG ĐIỂM SINH VIÊN</h1>
        </div>
        
        <div class="student-info">
          <p><strong>Mã sinh viên:</strong> ${studentInfo.studentCode}</p>
          <p><strong>Họ và tên:</strong> ${studentInfo.fullName}</p>
          <p><strong>Lớp:</strong> ${studentInfo.className || 'N/A'}</p>
          <p><strong>Ngày in:</strong> ${new Date().toLocaleDateString('vi-VN')}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã môn</th>
              <th>Tên môn học</th>
              <th>Số TC</th>
              <th>Điểm GK</th>
              <th>Điểm CK</th>
              <th>Điểm TB</th>
              <th>Học kỳ</th>
            </tr>
          </thead>
          <tbody>
            ${grades.map((grade, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${grade.subject_code || 'N/A'}</td>
                <td>${grade.subject_name || 'N/A'}</td>
                <td>${grade.credits || 0}</td>
                <td>${grade.midterm_score?.toFixed(1) || 'N/A'}</td>
                <td>${grade.final_score?.toFixed(1) || 'N/A'}</td>
                <td>${((grade.midterm_score * 0.4 + grade.final_score * 0.6) || 0).toFixed(1)}</td>
                <td>${grade.semester || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p><em>Hệ thống quản lý sinh viên</em></p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    return true;
  } catch (error) {
    console.error('Print transcript failed:', error);
    return false;
  }
};
