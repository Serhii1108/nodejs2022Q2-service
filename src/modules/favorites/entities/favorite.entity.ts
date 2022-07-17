import { Album } from 'src/modules/albums/entities/album.entity';
import { Artist } from 'src/modules/artists/entities/artist.entity';
import { Track } from 'src/modules/tracks/entities/track.entity';

export class Favorite {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
