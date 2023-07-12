import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './common/middleware/winston';

async function bootstrap() {
  logger.info(
    `================= API Start - ${process.env.NODE_ENV} !!=================`,
  );
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(3000);
}
bootstrap();
