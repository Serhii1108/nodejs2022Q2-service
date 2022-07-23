import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CreateAlbumDto } from '../dto/create-album.dto.js';
import { UpdateAlbumDto } from '../dto/update-album.dto.js';

import { Album } from '../entities/album.entity.js';
import { Track } from '../../tracks/entities/track.entity.js';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
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

    await this.deleteAlbumIdFromTracks(id);
  }

  private async deleteAlbumIdFromTracks(id: uuid) {
    const tracks: Track[] = await this.trackRepository.find({
      where: { albumId: id },
    });

    tracks.forEach(async (track) => {
      track.albumId = null;
      await this.trackRepository.save(track);
    });
  }
}
