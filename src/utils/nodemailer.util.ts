import nodemailer from 'nodemailer';
import config from '../config';

export const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_PASSWORD,
  },
});
