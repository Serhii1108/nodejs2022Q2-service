import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Favorite } from '../entities/favorite.entity.js';
import { Album } from '../../albums/entities/album.entity.js';
import { Track } from '../../tracks/entities/track.entity.js';
import { Artist } from '../../artists/entities/artist.entity.js';

export type Favorites = {
  id: uuid;
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
};
export type FavsItemsNames = 'artists' | 'albums' | 'tracks';
export type FavsItemsArr = Artist[] | Album[] | Track[];
export type FavsItems = Artist | Album | Track;

export type FavsRes = { status: number; message: string };
const successfullyRes: FavsRes = {
  status: 201,
  message: 'Added successfully',
};

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
  ) {}

  async getAll() {
    return (await this.getFavs()).toResponse();
  }

  async addToFavs(id: uuid, favsItemsNames: FavsItemsNames) {
    const favs: Favorites = (await this.getFavs()).toUpdate();
    const favsItems: FavsItemsArr = favs[favsItemsNames];

    const itemToAdd = await this.checkItem(id, favsItemsNames);

    if (!this.isItemAlreadyInFavs(id, favsItems)) {
      favsItems.push(itemToAdd as Artist & Album & Track);
      await this.favoritesRepository.save(favs);
    }

    return successfullyRes;
  }

  async deleteFromFavs(id: uuid, favsItemsNames: FavsItemsNames) {
    const favs: Favorites = (await this.getFavs()).toUpdate();
    const favsItems: FavsItemsArr = favs[favsItemsNames];

    await this.checkItem(id, favsItemsNames);

    if (!this.isItemAlreadyInFavs(id, favsItems))
      throw new NotFoundException('Item is not favorite');

    favs[favsItemsNames] = this.filterItems(id, favsItems);

    await this.favoritesRepository.save(favs);
  }

  private async getFavs() {
    return await this.favoritesRepository
      .createQueryBuilder('favorites')
      .leftJoinAndSelect('favorites.artists', 'artists')
      .leftJoinAndSelect('favorites.albums', 'albums')
      .leftJoinAndSelect('favorites.tracks', 'tracks')
      .getOne();
  }

  private async getItem(
    id: uuid,
    favsItemsNames: FavsItemsNames,
  ): Promise<FavsItems | undefined> {
    switch (favsItemsNames) {
      case 'artists':
        return await this.artistsRepository.findOneBy({ id });
      case 'albums':
        return await this.albumsRepository.findOneBy({ id });
      case 'tracks':
        return await this.tracksRepository.findOneBy({ id });
      default:
        return undefined;
    }
  }

  private async checkItem(id: uuid, favsItemsNames: FavsItemsNames) {
    const item: FavsItems = await this.getItem(id, favsItemsNames);
    if (!item) throw new UnprocessableEntityException('Item not found');

    return item;
  }

  private isItemAlreadyInFavs(id: uuid, favs: FavsItemsArr) {
    let isItemInFavs = false;

    favs.forEach((item: { id: uuid }) => {
      if (item.id === id) isItemInFavs = true;
    });
    return isItemInFavs;
  }

  private filterItems(id: uuid, favsItems: FavsItemsArr) {
    const filteredItems = (favsItems as { id: uuid }[]).filter(
      (item: { id: uuid }) => item.id !== id,
    );
    return filteredItems as Artist[] & Album[] & Track[];
  }
}
