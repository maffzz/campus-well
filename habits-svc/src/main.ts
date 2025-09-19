import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();              // habilita CORS correctamente
  await app.listen(8083, '0.0.0.0'); // escucha en todas las interfaces
}
bootstrap();
