import { ConsoleLogger, Injectable } from '@nestjs/common';

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
      console.log(`${this.defMessage}LOG   ${message}`);
    }
  }

  error(message: string) {
    if (this.logLevel >= 2) {
      console.log(`${this.defMessage}ERROR   ${message}`);
    }
  }

  warn(message: string) {
    if (this.logLevel >= 3) {
      console.log(`${this.defMessage}WARN   ${message}`);
    }
  }

  debug(message: string) {
    if (this.logLevel >= 4) {
      console.log(`${this.defMessage}DEBUG   ${message}`);
    }
  }

  verbose(message: string) {
    if (this.logLevel >= 5) {
      console.log(`${this.defMessage}VERBOSE   ${message}`);
    }
  }
}
