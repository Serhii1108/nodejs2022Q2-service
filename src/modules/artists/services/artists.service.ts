import { Injectable, NotFoundException } from '@nestjs/common';

import Database from '../../../db/db.js';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistDto } from '../dto/update-artist.dto';
import { Artist } from '../entities/artist.entity.js';

@Injectable()
export class ArtistsService {
  async getAll(): Promise<Artist[]> {
    return await Database.getAllArtists();
  }

  async findById(id: uuid): Promise<Artist> {
    const artist: Artist | undefined = await Database.findArtistById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    return await Database.createArtist(createArtistDto);
  }

  async updateArtist(id: uuid, updateArtistDto: UpdateArtistDto) {
    const artist: Artist | undefined = await Database.findArtistById(id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return await Database.updateArtist(id, updateArtistDto);
  }

  async deleteArtist(id: uuid) {
    const deletedArtist: Artist | undefined = await Database.deleteArtist(id);
    if (!deletedArtist) throw new NotFoundException('Artist not found');
  }
}
