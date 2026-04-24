import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir peticiones desde el frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://nova-libros-frontend.vercel.app',
      'https://www.novalibros.app/',
      'https://novalibros.app/',
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('NovaLibros API')
    .setDescription('API para la gestión de NovaLibros')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = Number(process.env.PORT) || 3012;
  
  await app.listen(port, '0.0.0.0');
  
  console.log(`Application running on http://0.0.0.0:${port}/api`);
}
bootstrap();

