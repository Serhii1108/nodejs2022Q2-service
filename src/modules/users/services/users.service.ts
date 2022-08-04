import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CreateUserDto } from '../dto/createUser.dto.js';
import { UpdatePasswordDto } from '../dto/updatePassword.dto.js';
import { User } from '../entities/user.entity.js';

import { hashPassword } from '../../../utils/hashPassword.js';
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
    const user: User | undefined = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdAt = Date.now();
    const hash = await hashPassword(createUserDto.password);

    const createdUser: User = this.usersRepository.create({
      ...createUserDto,
      password: hash,
      createdAt,
      updatedAt: createdAt,
    });

    await this.usersRepository.save(createdUser);

    return await this.findById(createdUser.id);
  }

  async updatePassword(
    id: uuid,
    { oldPassword, newPassword }: UpdatePasswordDto,
  ): Promise<User> {
    const user: User = await this.findById(id);

    const match = await bcrypt.compare(user.password, oldPassword);

    if (!match) throw new ForbiddenException('Password is wrong');

    user.password = newPassword;
    user.updatedAt = Date.now();

    await this.usersRepository.save(user);

    return await this.findById(user.id);
  }

  async deleteUser(id: uuid) {
    const deletedUser: DeleteResult = await this.usersRepository.delete({ id });
    if (!deletedUser.affected) throw new NotFoundException('User not found');
  }
}
