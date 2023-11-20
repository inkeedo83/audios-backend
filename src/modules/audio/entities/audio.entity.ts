import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Audio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  genre: string;

  @Column('text')
  imageFilename: string;

  @Column('text')
  audioFilename: string;
}
