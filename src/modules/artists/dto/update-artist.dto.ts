import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto.js';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {}
