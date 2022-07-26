import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { Artist } from '../../artists/entities/artist.entity.js';
import { Album } from '../../albums/entities/album.entity.js';

@Entity('track')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  duration: number;

  // Artist id
  @ManyToOne(() => Artist, (artist) => artist.id, {
    nullable: true,
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'SET NULL',
  })
  artist: Relation<Artist>;

  @Column({ nullable: true })
  artistId: string | null;

  // Album id
  @ManyToOne(() => Album, (album) => album.id, {
    nullable: true,
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'SET NULL',
  })
  album: Relation<Album>;

  @Column({ nullable: true })
  albumId: string | null;
}
