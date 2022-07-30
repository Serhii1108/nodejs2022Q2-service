import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { Album } from '../../albums/entities/album.entity.js';
import { Track } from '../../tracks/entities/track.entity.js';

@Entity('artist')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany('Album', 'artist', {
    nullable: true,
    onDelete: 'SET NULL',
    cascade: ['insert', 'update'],
  })
  albums: Relation<Album[]>;

  @OneToMany('Track', 'artist', {
    nullable: true,
    onDelete: 'SET NULL',
    cascade: ['insert', 'update'],
  })
  tracks: Relation<Track[]>;
}
