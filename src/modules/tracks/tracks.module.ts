import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TracksService } from './services/tracks.service.js';
import { TracksController } from './tracks.controller.js';
import { Track } from './entities/track.entity.js';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([Track])],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
