import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlbumsService } from './services/albums.service.js';
import { AlbumsController } from './albums.controller.js';

import { Album } from './entities/album.entity.js';
import { Track } from '../tracks/entities/track.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Track])],
  controllers: [AlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}
