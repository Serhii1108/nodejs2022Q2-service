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
import { Logger } from './logger/services/logger.service.js';
import { CustomExceptionFilter } from './logger/customException.filter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;

const logLevels = [0, 1, 2, 3, 4];
const logLevel = logLevels.includes(+process.env.LOGGING_LEVEL)
  ? +process.env.LOGGING_LEVEL
  : 3;

const maxLogFileSize = process.env.MAX_LOG_FILE_SIZE || 100;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(logLevel, +maxLogFileSize),
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new CustomExceptionFilter());

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
