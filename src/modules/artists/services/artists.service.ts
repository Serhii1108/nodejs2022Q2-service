import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistDto } from '../dto/update-artist.dto';
import { Artist } from '../entities/artist.entity.js';

import { Album } from '../../albums/entities/album.entity.js';
import { Track } from '../../tracks/entities/track.entity.js';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}

  async getAll(): Promise<Artist[]> {
    return await this.artistsRepository.find();
  }

  async findById(id: uuid): Promise<Artist> {
    const artist: Artist | undefined = await this.artistsRepository.findOneBy({
      id,
    });
    if (!artist) throw new NotFoundException('Artist not found');

    return artist;
  }

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    const createdArtist: Artist =
      this.artistsRepository.create(createArtistDto);
    await this.artistsRepository.save(createdArtist);

    return createdArtist;
  }

  async updateArtist(id: uuid, { name, grammy }: UpdateArtistDto) {
    const artist: Artist = await this.findById(id);

    artist.grammy = grammy;
    artist.name = name;

    return await this.artistsRepository.save(artist);
  }

  async deleteArtist(id: uuid) {
    const deletedArtist: DeleteResult = await this.artistsRepository.delete({
      id,
    });
    if (!deletedArtist.affected)
      throw new NotFoundException('Artist not found');

    await this.deleteArtistIdFromAlbums(id);
    await this.deleteArtistIdFromTracks(id);
  }

  private async deleteArtistIdFromAlbums(id: uuid) {
    const albums: Album[] = await this.albumRepository.find({
      where: { artistId: id },
    });

    albums.forEach(async (album) => {
      album.artistId = null;
      await this.albumRepository.save(album);
    });
  }

  private async deleteArtistIdFromTracks(id: uuid) {
    const tracks: Track[] = await this.trackRepository.find({
      where: { artistId: id },
    });

    tracks.forEach(async (track) => {
      track.artistId = null;
      await this.trackRepository.save(track);
    });
  }
}
