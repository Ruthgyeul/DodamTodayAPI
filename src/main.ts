import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { HttpException, HttpStatus, ValidationPipe } from "@nestjs/common";

import { IsString, IsInt, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsInt()
  age: number;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

  // Global validation pipes
  app.useGlobalPipes(new ValidationPipe());

  // Custom 404 handling for non-existing routes
  app.use((req, res, next) => {
    res.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: "The resource you are looking for does not exist.",
    });
  });

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();