import AWS from 'aws-sdk';
import config from '../config';

export const ses = new AWS.SES({
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
  region: config.AWS_REGION
});