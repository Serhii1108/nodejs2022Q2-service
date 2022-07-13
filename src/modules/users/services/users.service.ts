import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import Database from '../../../db/db.js';
import { CreateUserDto } from '../dto/createUser.dto.js';
import { UpdatePasswordDto } from '../dto/updatePassword.dto.js';
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

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await Database.createUser(createUserDto);
  }

  async updatePassword(
    id: uuid,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const user: User | undefined = await Database.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Password is wrong');
    }

    return await Database.updatePassword(id, updatePasswordDto);
  }

  async deleteUser(id: uuid) {
    const deletedUser: User | undefined = await Database.deleteUser(id);
    if (!deletedUser) throw new NotFoundException('User not found');
  }
}
