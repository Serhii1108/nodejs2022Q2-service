import { Module } from '@nestjs/common';
import { FavoritesService } from './services/favorites.service.js';
import { FavoritesController } from './favorites.controller.js';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
