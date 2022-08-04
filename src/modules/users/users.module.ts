import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller.js';
import { UsersService } from './services/users.service.js';
import { User } from './entities/user.entity.js';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
