import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TracksService } from './services/tracks.service.js';
import { TracksController } from './tracks.controller.js';
import { Track } from './entities/track.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
