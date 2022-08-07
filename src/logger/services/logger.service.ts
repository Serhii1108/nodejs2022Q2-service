import { ConsoleLogger, Injectable } from '@nestjs/common';
import { lstatSync, readdirSync, statSync, writeFileSync } from 'fs';
import path from 'path';

interface SetCurrLogFileNameDto {
  size: number;
  type: 'error' | 'info';
  file: string;
}

@Injectable()
export class Logger extends ConsoleLogger {
  private logLevel: number;

  private maxLogFileSize: number;
  private currInfoLogFileName: string;
  private currErrorsLogFileName: string;

  constructor(logLevel: number, maxLogFileSize: number) {
    super();
    this.logLevel = logLevel;
    this.maxLogFileSize = maxLogFileSize;
  }

  get getCurrTime() {
    const date = new Date();
    const currTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return currTime;
  }

  get defMessage() {
    return `[Nest] ${process.pid}  - ${this.getCurrTime}\t`;
  }

  set setCurrLogFileName({ size, type, file }: SetCurrLogFileNameDto) {
    if (size >= this.maxLogFileSize * 1024) {
      if (type === 'error') {
        this.currErrorsLogFileName = `errors-${Date.now()}.log`;
      } else {
        this.currInfoLogFileName = `info-${Date.now()}.log`;
      }
    } else {
      if (type === 'error') {
        this.currErrorsLogFileName = file;
      } else {
        this.currInfoLogFileName = file;
      }
    }
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

    if (isError) {
      this.checkFileSize(errorsDirname, 'error');
      writeFileSync(
        `${errorsDirname}/${this.currErrorsLogFileName}`,
        `${message}\n`,
        { flag: 'a+' },
      );
    } else {
      this.checkFileSize(logDirname, 'info');
      writeFileSync(
        `${logDirname}/${this.currInfoLogFileName}`,
        `${message}\n`,
        { flag: 'a+' },
      );
    }
  }

  private checkFileSize(dir: string, type: 'info' | 'error') {
    if (!this.isDirEmpty(dir)) {
      const file = this.getMostRecentFile(dir);
      const { size } = statSync(`${dir}/${file}`);

      this.setCurrLogFileName = { size, type, file };
    } else {
      if (type === 'error') {
        this.currErrorsLogFileName = `errors-${Date.now()}.log`;
      } else {
        this.currInfoLogFileName = `info-${Date.now()}.log`;
      }
    }
  }

  private isDirEmpty(dirname: string): boolean {
    const files = readdirSync(dirname);
    return files.length === 0;
  }

  private getMostRecentFile(dir: string): string {
    const files = this.orderRecentFiles(dir);
    return files[0] ? files[0].file : undefined;
  }

  private orderRecentFiles(dir: string): {
    file: string;
    mtime: Date;
  }[] {
    return readdirSync(dir)
      .filter((file) => lstatSync(path.join(dir, file)).isFile())
      .map((file) => ({
        file,
        mtime: lstatSync(path.join(dir, file)).mtime,
      }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  }
}
