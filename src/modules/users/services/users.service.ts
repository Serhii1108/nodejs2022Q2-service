import { Injectable, NotFoundException } from '@nestjs/common';

import Database from '../../../db/db.js';
import { User } from '../entity/user.entity.js';

@Injectable()
export class UsersService {
  async getAll(): Promise<User[]> {
    return await Database.getAll();
  }

  async findById(id: uuid): Promise<User> {
    const user: User | undefined = await Database.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
