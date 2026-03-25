// testEmail.js
import 'dotenv/config';
import { sendEmail } from '../src/emailService';

const test = async () => {
  await sendEmail({
    to: 'test@test.com',
    subject: 'Prueba',
    text: 'Hola',
    html: '<h1>Funciona</h1>',
  });
};

test();
