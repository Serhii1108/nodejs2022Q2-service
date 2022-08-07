import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dataSource } from './orm.config.js';

import { AppService } from './app.service.js';
import { AppController } from './app.controller.js';

import { UsersModule } from './modules/users/users.module.js';
import { AlbumsModule } from './modules/albums/albums.module.js';
import { ArtistsModule } from './modules/artists/artists.module.js';
import { TracksModule } from './modules/tracks/tracks.module.js';
import { FavoritesModule } from './modules/favorites/favorites.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { LoggerModule } from './logger/logger.module.js';

import { LoggerMiddleware } from './logger/logger.middleware.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(dataSource.options),
    UsersModule,
    ArtistsModule,
    AlbumsModule,
    TracksModule,
    FavoritesModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
