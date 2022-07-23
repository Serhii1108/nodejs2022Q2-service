import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlbumsService } from './services/albums.service.js';
import { AlbumsController } from './albums.controller.js';
import { Album } from './entities/album.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Album])],
  controllers: [AlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}
