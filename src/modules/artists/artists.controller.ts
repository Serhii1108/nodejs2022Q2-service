import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { ArtistsService } from './services/artists.service.js';
import { CreateArtistDto } from './dto/create-artist.dto.js';
import { UpdateArtistDto } from './dto/update-artist.dto.js';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  async GetAll() {
    return await this.artistsService.getAll();
  }

  @Get(':id')
  async findById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid) {
    return await this.artistsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createArtist(@Body() createArtistDto: CreateArtistDto) {
    return await this.artistsService.createArtist(createArtistDto);
  }

  @Put(':id')
  async updateArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return await this.artistsService.updateArtist(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return await this.artistsService.deleteArtist(id);
  }
}
