import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../../users/entities/user.entity.js';
import { CreateUserDto } from '../../users/dto/createUser.dto.js';
import { UsersService } from '../../users/services/users.service.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string) {
    const user: User | undefined = await this.usersRepository.findOneBy({
      login,
    });

    if (user && user.password === password) return user;

    return null;
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }

  async login({ login, password }: CreateUserDto) {
    const user: User = await this.validateUser(login, password);

    if (!user) {
      throw new ForbiddenException();
    }

    const payload = { login, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
