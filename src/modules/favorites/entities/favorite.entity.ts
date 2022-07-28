import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Album } from '../../albums/entities/album.entity.js';
import { Artist } from '../../artists/entities/artist.entity.js';
import { Track } from '../../tracks/entities/track.entity.js';

@Entity('favorite')
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: uuid;

  @ManyToMany(() => Artist, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  @JoinTable()
  artists: Artist[];

  @ManyToMany(() => Album, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  @JoinTable()
  albums: Album[];

  @ManyToMany(() => Track, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  @JoinTable()
  tracks: Track[];

  toResponse() {
    const { artists, albums, tracks } = this;
    return { artists, albums, tracks };
  }

  toUpdate() {
    const { id, artists, albums, tracks } = this;
    return { id, artists, albums, tracks };
  }
}
