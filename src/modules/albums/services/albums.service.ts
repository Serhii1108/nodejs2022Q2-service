import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { Album } from '../entities/album.entity.js';
import { CreateAlbumDto } from '../dto/create-album.dto.js';
import { UpdateAlbumDto } from '../dto/update-album.dto.js';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
  ) {}

  async getAll(): Promise<Album[]> {
    return await this.albumsRepository.find();
  }

  async findById(id: uuid) {
    const album: Album | undefined = await this.albumsRepository.findOneBy({
      id,
    });
    if (!album) throw new NotFoundException('Album not found');

    return album;
  }

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const createdAlbum: Album = this.albumsRepository.create(createAlbumDto);
    await this.albumsRepository.save(createdAlbum);

    return createdAlbum;
  }

  async updateAlbum(
    id: uuid,
    { name, year, artistId }: UpdateAlbumDto,
  ): Promise<Album> {
    const album: Album = await this.findById(id);

    album.name = name;
    album.year = year;
    album.artistId = artistId;

    return await this.albumsRepository.save(album);
  }

  async deleteAlbum(id: uuid) {
    const deletedAlbum: DeleteResult = await this.albumsRepository.delete({
      id,
    });
    if (!deletedAlbum.affected) throw new NotFoundException('Album not found');
  }
}
