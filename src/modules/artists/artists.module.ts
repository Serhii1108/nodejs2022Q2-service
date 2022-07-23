import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArtistsService } from './services/artists.service.js';
import { ArtistsController } from './artists.controller.js';

import { Artist } from './entities/artist.entity.js';
import { Album } from '../albums/entities/album.entity.js';
import { Track } from '../tracks/entities/track.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, Album, Track])],
  controllers: [ArtistsController],
  providers: [ArtistsService],
})
export class ArtistsModule {}
