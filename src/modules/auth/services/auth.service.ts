import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../../users/entities/user.entity.js';
import { CreateUserDto } from '../../users/dto/createUser.dto.js';
import { UsersService } from '../../users/services/users.service.js';

interface Payload {
  login: string;
  sub: uuid;
}

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

    const match = user ? await bcrypt.compare(password, user.password) : false;

    if (!match) return null;

    return user;
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }

  async login({ login, password }: CreateUserDto) {
    const user: User = await this.validateUser(login, password);

    if (!user) {
      throw new ForbiddenException();
    }

    return this.createTokens({ login, sub: user.id });
  }

  async refresh(refreshToken: string) {
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException();
    }

    const secret = process.env.JWT_SECRET_REFRESH_KEY;
    try {
      await this.jwtService.verify(refreshToken, { secret });
    } catch {
      throw new ForbiddenException();
    }

    const { login, sub } = this.jwtService.decode(refreshToken) as Payload;

    return this.createTokens({ login, sub });
  }

  private createTokens(payload: Payload) {
    const refreshTokenOptions = {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, refreshTokenOptions),
    };
  }
}
