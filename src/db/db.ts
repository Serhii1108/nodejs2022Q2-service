import { CreateUserDto } from 'src/modules/users/dto/createUser.dto.js';
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
}

export default new Database();
