import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

import { FavoritesService } from './services/favorites.service.js';

@Controller('favs')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getAll() {
    return await this.favoritesService.getAll();
  }

  // Tracks
  @Post('/track/:id')
  async addTrackToFavs(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid,
  ) {
    return await this.favoritesService.addToFavs(id, 'tracks');
  }

  @Delete('/track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrackFromFavs(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid,
  ) {
    await this.favoritesService.deleteFromFavs(id, 'tracks');
  }

  // Albums
  @Post('/album/:id')
  async addAlbumToFavs(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid,
  ) {
    return await this.favoritesService.addToFavs(id, 'albums');
  }

  @Delete('/album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbumFromFavs(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid,
  ) {
    await this.favoritesService.deleteFromFavs(id, 'albums');
  }

  // Artists
  @Post('/artist/:id')
  async addArtistToFavs(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid,
  ) {
    return await this.favoritesService.addToFavs(id, 'artists');
  }

  @Delete('/artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtistFromFavs(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid,
  ) {
    await this.favoritesService.deleteFromFavs(id, 'artists');
  }
}
