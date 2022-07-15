import { Module } from '@nestjs/common';

import { AppService } from './app.service.js';
import { AppController } from './app.controller.js';

import { UsersModule } from './modules/users/users.module.js';
import { AlbumsModule } from './modules/albums/albums.module.js';
import { ArtistsModule } from './modules/artists/artists.module.js';

@Module({
  imports: [UsersModule, ArtistsModule, AlbumsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
