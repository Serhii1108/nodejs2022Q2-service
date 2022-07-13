import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';

import { User } from './entity/user.entity.js';
import { UsersService } from './services/users.service.js';

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
}
