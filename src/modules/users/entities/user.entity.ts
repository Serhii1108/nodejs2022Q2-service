import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';

import { IntTransformer } from '../../../utils/intTransformer.js';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: uuid;

  @Column()
  login: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @VersionColumn()
  version: number;

  @Column('int8', { transformer: new IntTransformer() })
  createdAt: number;

  @Column('int8', { transformer: new IntTransformer() })
  updatedAt: number;
}
