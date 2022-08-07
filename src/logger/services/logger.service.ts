import { ConsoleLogger, Injectable } from '@nestjs/common';
import { writeFile } from 'fs';

@Injectable()
export class Logger extends ConsoleLogger {
  private logLevel: number;

  constructor(logLevel: number) {
    super();
    this.logLevel = logLevel;
  }

  get getCurrTime() {
    const date = new Date();
    const currTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return currTime;
  }

  get defMessage() {
    return `[Nest] ${process.pid}  - ${this.getCurrTime}\t`;
  }

  log(message: string) {
    if (this.logLevel >= 1) {
      const logMessage = `${this.defMessage}LOG   ${message}`;
      this.createLog(logMessage);
      console.log(logMessage);
    }
  }

  error(message: string) {
    if (this.logLevel >= 2) {
      const logMessage = `${this.defMessage}ERROR   ${message}`;
      this.createLog(logMessage, true);
      console.error(logMessage);
    }
  }

  warn(message: string) {
    if (this.logLevel >= 3) {
      const logMessage = `${this.defMessage}WARN   ${message}`;
      this.createLog(logMessage);
      console.warn(logMessage);
    }
  }

  debug(message: string) {
    if (this.logLevel >= 4) {
      const logMessage = `${this.defMessage}DEBUG   ${message}`;
      this.createLog(logMessage);
      console.debug(logMessage);
    }
  }

  verbose(message: string) {
    if (this.logLevel >= 5) {
      const logMessage = `${this.defMessage}VERBOSE   ${message}`;
      this.createLog(logMessage);
      console.log(logMessage);
    }
  }

  private createLog(message: string, isError = false) {
    const logDirname = './logs/info';
    const errorsDirname = './logs/errors';

    if (!isError) {
      writeFile(
        `${logDirname}/info.log`,
        `${message}\n`,
        { flag: 'a+' },
        (err) => {
          if (err) throw err;
        },
      );
    } else {
      writeFile(
        `${errorsDirname}/errors.log`,
        `${message}\n`,
        { flag: 'a+' },
        (err) => {
          if (err) throw err;
        },
      );
    }
  }
}
