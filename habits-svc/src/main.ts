import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Configuración de Swagger ---
  const config = new DocumentBuilder()
    .setTitle('habits-svc')
    .setDescription('API de hábitos de estudiantes')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui.html', app, document);

  // --- ✅ Configuración de CORS ---
  app.enableCors({
    origin: [
      'http://localhost:3000', // Frontend React en desarrollo
      'http://127.0.0.1:3000',
      'http://frontend:80', // frontend en Docker
      'http://campuswell-frontend-1:80', // nombre del contenedor
      // 'https://tudominio.com'  // 👉 agrega tu dominio en producción si aplica
    ],
    methods: '*',         // Permite todos los métodos (GET, POST, etc.)
    allowedHeaders: '*',  // Permite todos los headers
    credentials: true     // Necesario si usas cookies o auth
  });

  await app.listen(8083, '0.0.0.0');
}
bootstrap();
