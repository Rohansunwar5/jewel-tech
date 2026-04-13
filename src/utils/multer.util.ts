import multer from 'multer';
import path from 'path';

const ALLOWED_IMAGE_EXTS = ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'gif', 'GIF', 'webp', 'WEBP'];

export const imageUpload = multer({
  limits: { fileSize: 5 * 1000 * 1000 }, // 5 MB
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, callback) => {
    const ext = path.extname(file.originalname).replace('.', '');
    if (!ALLOWED_IMAGE_EXTS.includes(ext)) {
      return callback(new Error('Only images are allowed'));
    }
    callback(null, true);
  },
});
