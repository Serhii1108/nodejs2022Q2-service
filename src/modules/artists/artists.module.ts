import { Module } from '@nestjs/common';
import { ArtistsService } from './services/artists.service.js';
import { ArtistsController } from './artists.controller.js';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService],
})
export class ArtistsModule {}
