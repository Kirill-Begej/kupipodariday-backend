import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import validationException from './exceptions/validation.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('port');

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return validationException(errors);
      },
    }),
  );
  await app.listen(PORT);
}
bootstrap();
