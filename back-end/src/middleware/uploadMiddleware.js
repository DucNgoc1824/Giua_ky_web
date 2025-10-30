const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-zip-compressed',
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    // 3D Models
    'model/gltf-binary',  // .glb
    'model/gltf+json',    // .gltf
    'application/octet-stream' // fallback for .glb/.gltf
  ];

  // Allowed extensions (fallback check)
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.zip', 
                             '.jpg', '.jpeg', '.png', '.gif', 
                             '.glb', '.gltf'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Allowed: ${allowedExtensions.join(', ')}`), false);
  }
};

const limits = {
  fileSize: 50 * 1024 * 1024, // Increase to 50MB for 3D models
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

module.exports = upload;