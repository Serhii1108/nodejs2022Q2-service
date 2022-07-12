import { Injectable } from '@nestjs/common';

import Database from '../../../db/db.js';
import { User } from '../interfaces/user.entity.js';

@Injectable()
export class UsersService {
  async getAll(): Promise<User[]> {
    return await Database.getAll();
  }
}
