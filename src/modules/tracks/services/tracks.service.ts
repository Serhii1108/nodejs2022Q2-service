import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CreateTrackDto } from '../dto/create-track.dto.js';
import { UpdateTrackDto } from '../dto/update-track.dto.js';
import { Track } from '../entities/track.entity.js';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
  ) {}

  async getAll(): Promise<Track[]> {
    return await this.tracksRepository.find();
  }

  async findById(id: uuid) {
    const track: Track | undefined = await this.tracksRepository.findOneBy({
      id,
    });
    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    const createdTrack: Track = this.tracksRepository.create(createTrackDto);
    await this.tracksRepository.save(createdTrack);

    return createdTrack;
  }

  async updateTrack(
    id: uuid,
    { name, artistId, albumId, duration }: UpdateTrackDto,
  ): Promise<Track> {
    const track: Track = await this.findById(id);

    track.name = name;
    track.artistId = artistId;
    track.albumId = albumId;
    track.duration = duration;

    return await this.tracksRepository.save(track);
  }

  async deleteTrack(id: uuid) {
    const deletedTrack: DeleteResult = await this.tracksRepository.delete({
      id,
    });
    if (!deletedTrack.affected) throw new NotFoundException('Track not found');
  }
}
