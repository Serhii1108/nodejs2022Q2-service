import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';

import { User } from './entities/user.entity.js';
import { UsersService } from './services/users.service.js';
import { CreateUserDto } from './dto/createUser.dto.js';
import { UpdatePasswordDto } from './dto/updatePassword.dto.js';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(): Promise<User[]> {
    return await this.usersService.getAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: uuid) {
    return await this.usersService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  async updatePassword(
    @Param('id', ParseUUIDPipe) id: uuid,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    return await this.usersService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', ParseUUIDPipe) id: uuid) {
    await this.usersService.deleteUser(id);
  }
}
