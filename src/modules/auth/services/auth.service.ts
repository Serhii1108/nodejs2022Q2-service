import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../../users/entities/user.entity.js';
import { CreateUserDto } from '../../users/dto/createUser.dto.js';

type signupRes = {
  status: number;
  message: string;
};
const res: signupRes = {
  status: 201,
  message: 'User create successfully',
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<signupRes> {
    const createdAt = Date.now();

    const createdUser: User = this.usersRepository.create({
      ...createUserDto,
      createdAt,
      updatedAt: createdAt,
    });

    await this.usersRepository.save(createdUser);

    return res;
  }
}
