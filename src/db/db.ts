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
}

export default new Database();
