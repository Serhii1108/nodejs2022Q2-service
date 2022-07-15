import { User } from '../modules/users/entities/user.entity.js';
import { Album } from '../modules/albums/entities/album.entity.js';
import { Artist } from '../modules/artists/entities/artist.entity.js';

import { CreateUserDto } from '../modules/users/dto/createUser.dto.js';
import { CreateArtistDto } from '../modules/artists/dto/create-artist.dto.js';
import { UpdateArtistDto } from '../modules/artists/dto/update-artist.dto.js';
import { UpdatePasswordDto } from '../modules/users/dto/updatePassword.dto.js';
import { CreateAlbumDto } from '../modules/albums/dto/create-album.dto.js';
import { UpdateAlbumDto } from '../modules/albums/dto/update-album.dto.js';

interface StorageInterface {
  users: User[];
  artists: Artist[];
  albums: Album[];
}

type StorageItemsNames = 'users' | 'artists' | 'albums';
type StorageItems = User | Artist | Album;
type StorageItemsArr = User[] | Artist[] | Album[];
type CreateDtos = CreateUserDto | CreateArtistDto | CreateAlbumDto;

class Database {
  private readonly storage: StorageInterface = {
    users: [],
    artists: [],
    albums: [],
  };

  async getAll(storageItemName: StorageItemsNames): Promise<StorageItemsArr> {
    return this.storage[storageItemName];
  }

  async findById(
    id: uuid,
    storageItemName: StorageItemsNames,
  ): Promise<StorageItems | undefined> {
    let searchedItem: User | Artist | Album | undefined = undefined;
    const items: StorageItemsArr = this.storage[storageItemName];
    items.forEach((item: User | Artist | Album) => {
      if (item.id === id) searchedItem = item;
    });
    return searchedItem;
  }

  async createItem(
    createItemDto: CreateDtos,
    storageItemName: StorageItemsNames,
    itemToCreate: any,
  ): Promise<StorageItems> {
    const newItem = new itemToCreate({ ...createItemDto });
    this.storage[storageItemName].push(newItem);
    return newItem;
  }

  async deleteItem(
    id: uuid,
    storageItemName: StorageItemsNames,
  ): Promise<true | false> {
    const items: StorageItemsArr = this.storage[storageItemName];

    let isItemDeleted = false;
    const filteredItems = [];

    items.forEach((item: StorageItems) => {
      if (item.id === id) {
        isItemDeleted = true;
      } else {
        filteredItems.push(item);
      }
    });

    if (!isItemDeleted) return false;

    this.storage[storageItemName] = filteredItems;
    return true;
  }

  // Users
  async updatePassword(
    id: uuid,
    { newPassword }: UpdatePasswordDto,
  ): Promise<User> {
    const user: User = this.storage.users.find((user) => user.id === id);

    user.password = newPassword;
    user.version++;
    user.updatedAt = Date.now();

    return user;
  }

  // Artists
  async updateArtist(
    id: uuid,
    { name, grammy }: UpdateArtistDto,
  ): Promise<Artist> {
    const artist: Artist = this.storage.artists.find(
      (artist) => artist.id === id,
    );

    artist.name = name;
    artist.grammy = grammy;

    return artist;
  }

  // Albums
  async updateAlbum(
    id: uuid,
    { name, year, artistId }: UpdateAlbumDto,
  ): Promise<Album> {
    const album: Album = this.storage.albums.find((album) => album.id === id);

    album.name = name;
    album.year = year;
    album.artistId = artistId;

    return album;
  }
}

export default new Database();
