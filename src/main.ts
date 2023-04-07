import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggerService } from './modules/logger/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = app.get(ConfigService).get<number>('port');
  const logger = app.get(LoggerService);

  app.use(helmet());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Master4')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('master4')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app
    .listen(4000)
    .then(() => logger.log(`NestedJS server is listening on port ${port}`))
    .catch(console.error);
}
bootstrap();
