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
import { Album } from './entities/album.entity.js';
import { AlbumsService } from './services/albums.service.js';
import { CreateAlbumDto } from './dto/create-album.dto.js';
import { UpdateAlbumDto } from './dto/update-album.dto.js';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  GetAll() {
    return this.albumsService.getAll();
  }

  @Get(':id')
  findAlbumById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid) {
    return this.albumsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createAlbum(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.albumsService.createAlbum(createAlbumDto);
  }

  @Put(':id')
  updateAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumsService.updateAlbum(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid) {
    return this.albumsService.deleteAlbum(id);
  }
}
