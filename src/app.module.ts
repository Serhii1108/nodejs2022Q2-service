import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service.js';
import { AppController } from './app.controller.js';

import { UsersModule } from './modules/users/users.module.js';
import { AlbumsModule } from './modules/albums/albums.module.js';
import { ArtistsModule } from './modules/artists/artists.module.js';
import { TracksModule } from './modules/tracks/tracks.module.js';
import { FavoritesModule } from './modules/favorites/favorites.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      database: process.env.POSTGRES_DB,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      entities: ['dist/**/entities/*.entity.js'],
      synchronize: true,
    }),
    UsersModule,
    ArtistsModule,
    AlbumsModule,
    TracksModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
