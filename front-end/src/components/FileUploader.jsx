import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFile, FaTimes } from 'react-icons/fa';
import '../assets/FileUploader.css';

const FileUploader = ({ onUpload, accept = { 'application/pdf': ['.pdf'], 'application/msword': ['.doc', '.docx'] }, maxSize = 5242880 }) => {
  const [uploadedFiles, setUploadedFiles] = React.useState([]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles(acceptedFiles);
      onUpload(acceptedFiles);
    },
    accept,
    maxSize,
    multiple: false
  });

  const removeFile = () => {
    setUploadedFiles([]);
    onUpload([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="file-uploader">
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''}`}
      >
        <input {...getInputProps()} />
        <FaCloudUploadAlt className="upload-icon" size={48} />
        {isDragActive ? (
          <p className="dropzone-text">Thả file vào đây...</p>
        ) : (
          <>
            <p className="dropzone-text">Kéo thả file hoặc click để chọn</p>
            <p className="dropzone-hint">PDF, DOC, DOCX (tối đa {formatFileSize(maxSize)})</p>
          </>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="file-list">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="file-item">
              <FaFile className="file-icon" />
              <div className="file-info">
                <p className="file-name">{file.name}</p>
                <p className="file-size">{formatFileSize(file.size)}</p>
              </div>
              <button 
                type="button"
                className="remove-file-btn" 
                onClick={removeFile}
                aria-label="Xóa file"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
