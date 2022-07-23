import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
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

  @OneToOne(() => Artist, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @Column({ nullable: true })
  artistId: string | null;
}
