import 'dotenv/config';
import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import yaml from 'yaml';
import path from 'path';

import { AppModule } from './app.module.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const rootDirname = path.dirname(__dirname);
  const DOC_API = await readFile(
    path.join(rootDirname, 'doc', 'api.yaml'),
    'utf-8',
  );
  const document = yaml.parse(DOC_API);
  SwaggerModule.setup('doc', app, document);

  await app.listen(Number(PORT));
}
bootstrap();
