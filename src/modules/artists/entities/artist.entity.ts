import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  // constructor(partial: Partial<Artist>) {
  //   Object.assign(this, partial);

  //   this.id = v4();
  // }
}
