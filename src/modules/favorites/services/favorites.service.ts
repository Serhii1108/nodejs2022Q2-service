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
    const items = await Database.addToFavs(id, favsItemsNames);
    if (!items) throw new UnprocessableEntityException('Item not found');

    return items;
  }

  async deleteFromFavs(id: uuid, favsItemsNames: FavsItemsNames) {
    const items = await Database.deleteFromFavs(id, favsItemsNames);
    if (!items) throw new NotFoundException('Item is not favorite');

    return items;
  }
}
