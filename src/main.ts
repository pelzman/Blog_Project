import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './configs/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const Port = Number(env.PORT) || 3000
  await app.listen(Port);
  console.log(`App is running on port ${Port}`)
}
bootstrap();
