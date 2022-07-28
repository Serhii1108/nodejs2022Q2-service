import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { FavoritesService } from './services/favorites.service.js';
import { FavoritesController } from './favorites.controller.js';

import { Favorite } from './entities/favorite.entity.js';
import { Album } from '../albums/entities/album.entity.js';
import { Artist } from '../artists/entities/artist.entity.js';
import { Track } from '../tracks/entities/track.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, Album, Track, Favorite])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
