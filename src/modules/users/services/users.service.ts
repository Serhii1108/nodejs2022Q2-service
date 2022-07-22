import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { CreateUserDto } from '../dto/createUser.dto.js';
import { UpdatePasswordDto } from '../dto/updatePassword.dto.js';
import { User } from '../entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findById(id: uuid): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdAt = Date.now();
    const newUser: User = {
      ...createUserDto,
      id: v4(),
      version: 1,
      createdAt,
      updatedAt: createdAt,
    };

    const createdUser = this.usersRepository.create(newUser);
    await this.usersRepository.save(createdUser);

    return await this.findById(createdUser.id);
  }

  async updatePassword(
    id: uuid,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const user: User = await this.findById(id);

    if (user.password !== updatePasswordDto.oldPassword)
      throw new ForbiddenException('Password is wrong');

    const updatedUser: User = {
      ...user,
      password: updatePasswordDto.newPassword,
      updatedAt: Date.now(),
      version: (user.version += 1),
    };
    await this.usersRepository.save(updatedUser);

    return await this.findById(updatedUser.id);
  }

  async deleteUser(id: uuid) {
    const deletedUser = await this.usersRepository.delete({ id });
    if (!deletedUser.affected) throw new NotFoundException('User not found');
  }
}
