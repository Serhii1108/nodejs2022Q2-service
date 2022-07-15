import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import Database from '../../../db/db.js';
import { CreateUserDto } from '../dto/createUser.dto.js';
import { UpdatePasswordDto } from '../dto/updatePassword.dto.js';
import { User } from '../entities/user.entity.js';

@Injectable()
export class UsersService {
  async getAll(): Promise<User[]> {
    return (await Database.getAll('users')) as User[];
  }

  async findById(id: uuid): Promise<User> {
    const user: User | undefined = (await Database.findById(
      id,
      'users',
    )) as User;

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return (await Database.createItem(createUserDto, 'users', User)) as User;
  }

  async updatePassword(
    id: uuid,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const user: User | undefined = (await Database.findById(
      id,
      'users',
    )) as User;

    if (!user) throw new NotFoundException('User not found');
    if (user.password !== updatePasswordDto.oldPassword)
      throw new ForbiddenException('Password is wrong');

    return await Database.updatePassword(id, updatePasswordDto);
  }

  async deleteUser(id: uuid) {
    const isUserDeleted: boolean = await Database.deleteItem(id, 'users');
    if (!isUserDeleted) throw new NotFoundException('User not found');
  }
}
