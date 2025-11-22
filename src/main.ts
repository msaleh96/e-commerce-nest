import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { UserService } from './modules/user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      const messages = errors.map((err:any) => {
        return Object.values(err.constraints).join(', ');
      });
      return new BadRequestException(messages.join('; '));
    },
  }));
  app.useGlobalInterceptors(new CurrentUserInterceptor(app.get(UserService)));
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
