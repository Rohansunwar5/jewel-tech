import { Types } from 'mongoose';
import config from '../config';
import { BadRequestError } from '../errors/bad-request.error';
import { InternalServerError } from '../errors/internal-server.error';
import { s3 } from '../utils/s3.util';

const ROOT_FOLDER = 'roop-jewels';

class UploadService {
  constructor(private readonly _s3 = s3) {}

  async uploadToS3(
    file: Express.Multer.File,
    folder: string,
    fileName?: string
  ): Promise<{ url: string; key: string }> {
    const { buffer, mimetype, originalname } = file;
    const ext = originalname.split('.').pop();

    if (!buffer) throw new BadRequestError('No file buffer — multer memoryStorage is required');
    if (!mimetype) throw new BadRequestError('Invalid mimetype');

    const name = fileName || new Types.ObjectId().toString();
    const key = `${ROOT_FOLDER}/${folder}/${name}.${ext}`;

    const params = {
      Bucket: config.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    };

    try {
      const response = await this._s3.upload(params).promise();
      return { url: response.Location, key };
    } catch {
      throw new InternalServerError('Failed to upload file to S3');
    }
  }
}

export default new UploadService();
