import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { CreateUserDto } from '../users/dto/createUser.dto.js';
import { AuthService } from './services/auth.service.js';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: CreateUserDto) {
    return await this.authService.login(loginDto);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() { refreshToken }) {
    return await this.authService.refresh(refreshToken);
  }
}
