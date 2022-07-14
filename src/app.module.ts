import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ArtistsModule } from './modules/artists/artists.module.js';
import { UsersModule } from './modules/users/users.module.js';

@Module({
  imports: [UsersModule, ArtistsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
