import { CreateUserDto } from 'src/modules/users/dto/createUser.dto.js';
import { UpdatePasswordDto } from 'src/modules/users/dto/updatePassword.dto.js';
import { Artist } from '../modules/artists/entities/artist.entity.js';
import { User } from '../modules/users/entities/user.entity.js';
import { CreateArtistDto } from '../modules/artists/dto/create-artist.dto.js';
import { UpdateArtistDto } from 'src/modules/artists/dto/update-artist.dto.js';

interface StorageInterface {
  users: User[];
  artists: Artist[];
}

type StorageItems = 'users' | 'artists';

class Database {
  private storage: StorageInterface = {
    users: [],
    artists: [],
  };

  get users() {
    return this.storage.users;
  }

  get artists() {
    return this.storage.artists;
  }

  async getAll(itemType: StorageItems): Promise<User[] | Artist[]> {
    return this.storage[itemType];
  }

  //
  // Users
  //

  async findUserById(id: uuid): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new User({ ...createUserDto });
    this.users.push(newUser);
    return newUser;
  }

  async updatePassword(
    id: uuid,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const user: User = this.users.find((user) => user.id === id);
    user.password = updatePasswordDto.newPassword;
    user.version++;
    user.updatedAt = Date.now();
    return user;
  }

  async deleteUser(id: uuid): Promise<User | undefined> {
    const userToDelete: User | undefined = this.users.find(
      (user) => user.id === id,
    );

    if (!userToDelete) return userToDelete;

    this.storage.users = this.users.filter((user) => user.id !== id);
    return userToDelete;
  }

  //
  // Artists
  //

  async findArtistById(id: uuid): Promise<Artist | undefined> {
    return this.artists.find((artist) => artist.id === id);
  }

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = new Artist({ ...createArtistDto });
    this.artists.push(newArtist);
    return newArtist;
  }

  async updateArtist(
    id: uuid,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    const artist: Artist = this.artists.find((artist) => artist.id === id);

    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;
    return artist;
  }

  async deleteArtist(id: uuid): Promise<Artist | undefined> {
    const artistToDelete: Artist | undefined = this.artists.find(
      (artist) => artist.id === id,
    );

    if (!artistToDelete) return artistToDelete;

    this.storage.artists = this.artists.filter((artist) => artist.id !== id);
    return artistToDelete;
  }
}

export default new Database();
