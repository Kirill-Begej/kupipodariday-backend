import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('port');

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return new HttpException(
          errors[0].constraints.isLength,
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );
  await app.listen(PORT);
}
bootstrap();
