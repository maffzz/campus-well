import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ⚙️ Configuración Swagger antes del prefijo global
  const config = new DocumentBuilder()
    .setTitle('habits-svc')
    .setDescription('API de hábitos de estudiantes')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 👉 Montamos Swagger antes del prefijo global
  SwaggerModule.setup('swagger', app, document);

  // 🧩 Luego agregamos el prefijo global
  app.setGlobalPrefix('habits');

  app.enableCors({
    origin: ['*'],
    methods: '*',
    allowedHeaders: '*',
    credentials: true,
  });

  await app.listen(8083, '0.0.0.0');
}
bootstrap();
