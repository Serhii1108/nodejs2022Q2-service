import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { Artist } from '../../../modules/artists/entities/artist.entity.js';

@Entity('album')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @ManyToOne('Artist', 'id', {
    nullable: true,
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'SET NULL',
  })
  artist: Relation<Artist>;

  @Column({ nullable: true })
  artistId: string | null;
}
