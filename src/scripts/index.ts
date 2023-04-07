import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { initDb } from './initDb';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  await initDb(app);
}

run()
  .catch(console.error)
  .finally(() => process.exit(0));
