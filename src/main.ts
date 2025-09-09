import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const API_PREFIX = 'api';
  app.setGlobalPrefix(API_PREFIX);
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Warehouse internal system')
      .setDescription('Warehouse internal system API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${API_PREFIX}/swagger`, app, document);
  }
  const PORT = process.env.PORT || 3001;
  const HOST = process.env.HOST;
  await app.listen(PORT, () => {
    console.log(`Api is running on: ${HOST}:${PORT}/${API_PREFIX}`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Swagger: ${HOST}:${PORT}/${API_PREFIX}/swagger`);
    }
  });
}
bootstrap();
