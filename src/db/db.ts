import { User } from '../modules/users/entities/user.entity.js';
import { Album } from '../modules/albums/entities/album.entity.js';
import { Track } from 'src/modules/tracks/entities/track.entity.js';
import { Artist } from '../modules/artists/entities/artist.entity.js';

import { CreateUserDto } from '../modules/users/dto/createUser.dto.js';
import { CreateArtistDto } from '../modules/artists/dto/create-artist.dto.js';
import { UpdateArtistDto } from '../modules/artists/dto/update-artist.dto.js';
import { UpdatePasswordDto } from '../modules/users/dto/updatePassword.dto.js';
import { CreateAlbumDto } from '../modules/albums/dto/create-album.dto.js';
import { UpdateAlbumDto } from '../modules/albums/dto/update-album.dto.js';
import { CreateTrackDto } from 'src/modules/tracks/dto/create-track.dto.js';
import { UpdateTrackDto } from 'src/modules/tracks/dto/update-track.dto.js';

interface StorageInterface {
  users: User[];
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
  favorites: {
    artists: uuid[];
    albums: uuid[];
    tracks: uuid[];
  };
}

type StorageItemsNames = 'users' | 'artists' | 'albums' | 'tracks';
export type FavsItemsNames = 'artists' | 'albums' | 'tracks';
type StorageItems = User | Artist | Album | Track;
type StorageItemsArr = User[] | Artist[] | Album[] | Track[];
type CreateDtos =
  | CreateUserDto
  | CreateArtistDto
  | CreateAlbumDto
  | CreateTrackDto;

class Database {
  private readonly storage: StorageInterface = {
    users: [],
    artists: [],
    albums: [],
    tracks: [],
    favorites: {
      artists: [],
      albums: [],
      tracks: [],
    },
  };

  async getAll(storageItemName: StorageItemsNames): Promise<StorageItemsArr> {
    return this.storage[storageItemName];
  }

  async findById(
    id: uuid,
    storageItemName: StorageItemsNames,
  ): Promise<StorageItems | undefined> {
    let searchedItem: StorageItems | undefined = undefined;
    const items: StorageItemsArr = this.storage[storageItemName];
    items.forEach((item: StorageItems) => {
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
  ): Promise<boolean> {
    const items: StorageItemsArr = this.storage[storageItemName];
    let isItemDeleted = false;
    const filteredItems = [];

    if (items.length) {
      items.forEach((item: StorageItems) => {
        if (item.id === id) {
          isItemDeleted = true;
        } else {
          filteredItems.push(item);
        }
      });

      const tracks: Track[] = this.storage.tracks;
      if (items[0] instanceof Album) {
        tracks.forEach((track) => {
          if (track.albumId === id) track.albumId = null;
        });
      }
      if (items[0] instanceof Artist) {
        tracks.forEach((track) => {
          if (track.artistId === id) track.artistId = null;
        });
      }
    }

    if (!isItemDeleted) return false;

    this.storage[storageItemName] = filteredItems;
    return true;
  }

  // Favs
  async getAllFavs() {
    const {
      artists: artistsIds,
      albums: albumsIds,
      tracks: tracksIds,
    } = this.storage.favorites;

    const { artists, albums, tracks } = await this.parseFavs(
      artistsIds,
      albumsIds,
      tracksIds,
    );

    const favs = { artists, albums, tracks };
    return favs;
  }

  async parseFavs(
    artistsIds: string[],
    albumsIds: string[],
    tracksIds: string[],
  ) {
    const artists = (
      await Promise.all(
        artistsIds.map(async (id) => await this.findById(id, 'artists')),
      )
    ).filter((item) => item);

    const albums = (
      await Promise.all(
        albumsIds.map(async (id) => await this.findById(id, 'albums')),
      )
    ).filter((item) => item);

    const tracks = (
      await Promise.all(
        tracksIds.map(async (id) => await this.findById(id, 'tracks')),
      )
    ).filter((item) => item);

    return { artists, albums, tracks };
  }

  async addToFavs(id: uuid, favsItemsNames: FavsItemsNames) {
    const favs: uuid[] = this.storage.favorites[favsItemsNames];

    const item: StorageItems = await this.findById(id, favsItemsNames);
    if (!item) return undefined;

    let isItemAlreadyInFavs = false;
    favs.forEach((itemId: string) => {
      if (itemId === id) isItemAlreadyInFavs = true;
    });

    if (!isItemAlreadyInFavs) {
      favs.push(id);
    }

    return await this.getAllFavs();
  }

  async deleteFromFavs(id: uuid, favsItemsNames: FavsItemsNames) {
    const favs: uuid[] = this.storage.favorites[favsItemsNames];

    let isItemDeleted = false;
    this.storage.favorites[favsItemsNames] = favs.filter((itemId) => {
      if (id === itemId) {
        isItemDeleted = true;
        return false;
      } else {
        return true;
      }
    });

    if (!isItemDeleted) return undefined;

    return await this.getAllFavs();
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
  ): Promise<Artist | undefined> {
    const artist: Artist | undefined = this.storage.artists.find(
      (artist) => artist.id === id,
    );

    if (!artist) return undefined;

    artist.name = name;
    artist.grammy = grammy;

    return artist;
  }

  // Albums
  async updateAlbum(
    id: uuid,
    { name, year, artistId }: UpdateAlbumDto,
  ): Promise<Album | undefined> {
    const album: Album | undefined = this.storage.albums.find(
      (album) => album.id === id,
    );

    if (!album) return undefined;

    album.name = name;
    album.year = year;
    album.artistId = artistId;

    return album;
  }

  // Tracks
  async updateTrack(
    id: uuid,
    { name, artistId, albumId, duration }: UpdateTrackDto,
  ): Promise<Track | undefined> {
    const track: Track | undefined = this.storage.tracks.find(
      (track) => track.id === id,
    );

    if (!track) return undefined;

    track.name = name;
    track.artistId = artistId;
    track.albumId = albumId;
    track.duration = duration;

    return track;
  }
}

export default new Database();
