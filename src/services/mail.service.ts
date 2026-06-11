import { BadRequestError } from '../errors/bad-request.error';
import { mailTransporter } from '../utils/nodemailer.util';
import config from '../config';
import ejs from 'ejs';
import fs from 'fs';

class MailService {
  constructor(private readonly _transporter = mailTransporter) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async sendEmail(toEmail: string, templatePath: string, templateData: any, subject: string) {
    const html = ejs.render(
      fs.readFileSync(`src/templates/${templatePath}`, 'utf8'),
      templateData
    );

    const info = await this._transporter.sendMail({
      from: `Roop Jewellers <${config.GMAIL_USER}>`,
      to: toEmail,
      subject,
      html,
    });

    if (!info) throw new BadRequestError('Failed to send email');

    return {};
  }
}

export default new MailService();
