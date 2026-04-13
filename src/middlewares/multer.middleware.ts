import { imageUpload } from '../utils/multer.util';

// Single image upload under the 'image' field name — used by /admin/upload/assets
export const uploadImage = imageUpload.single('image');
