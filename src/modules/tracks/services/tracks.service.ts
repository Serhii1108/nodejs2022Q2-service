import { Injectable, NotFoundException } from '@nestjs/common';

import Database from '../../../db/db.js';

import { CreateTrackDto } from '../dto/create-track.dto.js';
import { UpdateTrackDto } from '../dto/update-track.dto.js';
import { Track } from '../entities/track.entity.js';

@Injectable()
export class TracksService {
  async getAll(): Promise<Track[]> {
    return Database.getAll('tracks') as Promise<Track[]>;
  }

  async findById(id: uuid) {
    const track: Track | undefined = (await Database.findById(
      id,
      'tracks',
    )) as Track;

    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    return (await Database.createItem(
      createTrackDto,
      'tracks',
      Track,
    )) as Track;
  }

  async updateTrack(id: uuid, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track: Track | undefined = await Database.updateTrack(
      id,
      updateTrackDto,
    );

    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  async deleteTrack(id: uuid) {
    const IsTrackDeleted: boolean = await Database.deleteItem(id, 'tracks');
    if (!IsTrackDeleted) throw new NotFoundException('Track not found');
  }
}
