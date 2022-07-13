import { CreateUserDto } from 'src/modules/users/dto/createUser.dto.js';
import { UpdatePasswordDto } from 'src/modules/users/dto/updatePassword.dto.js';
import { User } from '../modules/users/entity/user.entity.js';

interface StorageInterface {
  users: User[];
}

class Database {
  private storage: StorageInterface = {
    users: [],
  };

  get users() {
    return this.storage.users;
  }

  async getAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: uuid): Promise<User | undefined> {
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
}

export default new Database();
