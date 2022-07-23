import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
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
  @OneToOne(() => Artist, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artist_id' })
  private artist: Artist;

  @Column({ nullable: true })
  artistId: string | null;

  // Album id
  @OneToOne(() => Album, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'album_id' })
  private album: Album;

  @Column({ nullable: true })
  albumId: string | null;
}
