import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
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
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string) {
    const user: User | undefined = await this.usersRepository.findOneBy({
      login,
    });

    if (user && user.password === password) return user;

    return null;
  }

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

  async login({ login, password }: CreateUserDto) {
    const user: User = await this.validateUser(login, password);

    if (!user) {
      throw new ForbiddenException();
    }

    const payload = { login, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
