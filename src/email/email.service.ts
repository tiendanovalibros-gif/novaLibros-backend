import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
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
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'NovaLibros 📚 <onboarding@resend.dev>',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      if (error) {
        this.logger.error(`❌ Error al enviar email a ${options.to}`, error);
        throw new Error(error.message);
      }

      this.logger.log(`✅ Email enviado a ${options.to} — ID: ${data?.id}`);
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
