import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import Database, { FavsItemsNames } from '../../../db/db.js';

@Injectable()
export class FavoritesService {
  async getAll() {
    return await Database.getAllFavs();
  }

  async addToFavs(id: uuid, favsItemsNames: FavsItemsNames) {
    const res = await Database.addToFavs(id, favsItemsNames);
    if (!res) throw new UnprocessableEntityException('Item not found');

    return res;
  }

  async deleteFromFavs(id: uuid, favsItemsNames: FavsItemsNames) {
    const isItemDeleted = await Database.deleteFromFavs(id, favsItemsNames);
    if (!isItemDeleted) throw new NotFoundException('Item is not favorite');

    return isItemDeleted;
  }
}
