import multer from 'multer';
import path from 'path';

// Configure multer to store files temporarily
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|jpg|jpeg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (fileTypes.test(ext)) {
      return cb(null, true);
    }
    return cb(new Error('Only PDF and image files are allowed'));
  }
});

export default upload;