import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { welcomeTemplate } from './templates/welcome.template';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"NovaLibros 📚" <${process.env.MAIL_FROM}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      this.logger.log(
        `✅ Email enviado a ${options.to} — ID: ${info.messageId}`,
      );
    } catch (error) {
      this.logger.error(`❌ Error al enviar email a ${options.to}`, error);
      throw error;
    }
  }

  async sendWelcomeEmail(nombre: string, correo: string): Promise<void> {
    await this.sendEmail({
      to: correo,
      subject: '¡Bienvenido a NovaLibros! 📚',
      html: welcomeTemplate(nombre),
      text: `¡Hola ${nombre}! Bienvenido a NovaLibros. Tu cuenta fue creada exitosamente.`,
    });
  }
}
