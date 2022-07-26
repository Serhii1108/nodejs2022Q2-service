import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => Album, (album) => album.artist, {
    nullable: true,
    onDelete: 'SET NULL',
    cascade: ['insert', 'update'],
  })
  albums: Album[];

  @OneToMany(() => Track, (track) => track.artist, {
    nullable: true,
    onDelete: 'SET NULL',
    cascade: ['insert', 'update'],
  })
  tracks: Track[];
}
