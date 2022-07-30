import { Exclude } from 'class-transformer';
import { v4 } from 'uuid';

export class User {
  id: string;
  login: string;

  @Exclude()
  password: string;

  version: number;
  createdAt: number;
  updatedAt: number;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);

    this.id = v4();
    this.version = 1;
    this.createdAt = Date.now();
    this.updatedAt = this.createdAt;
  }
}
