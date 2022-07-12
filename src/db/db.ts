import { User } from '../modules/users/interfaces/user.entity.js';

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
}

export default new Database();
