import { Injectable, Logger } from '@nestjs/common';
import { MailtrapClient } from 'mailtrap';
import { welcomeTemplate } from './templates/welcome.template';
import { resetPasswordTemplate } from './templates/reset-password.template';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private client: MailtrapClient;

  constructor() {
    this.client = new MailtrapClient({
      token: process.env.MAILTRAP_API_TOKEN as string,
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      const response = await this.client.send({
        from: {
          name: 'NovaLibros 📚',
          email: process.env.MAIL_FROM as string,
        },
        to: [{ email: options.to }],
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      this.logger.log(
        `✅ Email enviado a ${options.to} — ID: ${response[0]?.message_ids?.[0]}`,
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

  async sendResetPasswordEmail(
    nombre: string,
    correo: string,
    resetLink: string,
  ): Promise<void> {
    await this.sendEmail({
      to: correo,
      subject: 'Recuperar Contraseña - NovaLibros 🔐',
      html: resetPasswordTemplate(nombre, resetLink),
      text: `Hola ${nombre}, recibimos una solicitud para restablecer tu contraseña. Usa este enlace para crear una nueva: ${resetLink}`,
    });
  }
}
