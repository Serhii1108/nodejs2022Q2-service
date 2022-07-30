import { Injectable, NotFoundException } from '@nestjs/common';

import Database from '../../../db/db.js';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistDto } from '../dto/update-artist.dto';
import { Artist } from '../entities/artist.entity.js';

@Injectable()
export class ArtistsService {
  async getAll(): Promise<Artist[]> {
    return (await Database.getAll('artists')) as Artist[];
  }

  async findById(id: uuid): Promise<Artist> {
    const artist: Artist | undefined = (await Database.findById(
      id,
      'artists',
    )) as Artist;

    if (!artist) throw new NotFoundException('Artist not found');

    return artist;
  }

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    return (await Database.createItem(
      createArtistDto,
      'artists',
      Artist,
    )) as Artist;
  }

  async updateArtist(id: uuid, updateArtistDto: UpdateArtistDto) {
    const artist: Artist | undefined = await Database.updateArtist(
      id,
      updateArtistDto,
    );

    if (!artist) throw new NotFoundException('Artist not found');

    return artist;
  }

  async deleteArtist(id: uuid) {
    const isArtistDeleted: boolean = await Database.deleteItem(id, 'artists');
    if (!isArtistDeleted) throw new NotFoundException('Artist not found');
  }
}
