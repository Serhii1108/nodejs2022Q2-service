import { Injectable, NotFoundException } from '@nestjs/common';

import Database from '../../../db/db.js';

import { Album } from '../entities/album.entity.js';
import { CreateAlbumDto } from '../dto/create-album.dto.js';
import { UpdateAlbumDto } from '../dto/update-album.dto.js';

@Injectable()
export class AlbumsService {
  async getAll(): Promise<Album[]> {
    return Database.getAll('albums') as Promise<Album[]>;
  }

  async findById(id: uuid) {
    const album: Album | undefined = await Database.findAlbumById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return Database.createAlbum(createAlbumDto);
  }

  async updateAlbum(id: uuid, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album: Album | undefined = await Database.findAlbumById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return Database.updateAlbum(id, updateAlbumDto);
  }

  async deleteAlbum(id: uuid) {
    const deletedAlbum: Album | undefined = await Database.deleteAlbum(id);
    if (!deletedAlbum) throw new NotFoundException('Album not found');
  }
}
