import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MinioClientService } from 'src/modules/minio/services/minio.service';
import { Audio } from '../entities/audio.entity';
import { Like, Repository } from 'typeorm';
import { AudioDto, ReadRecordsDto, UpdateRecordDto } from '../types/types';
import { omit } from 'lodash';

@Injectable()
export class AudioService {
  constructor(
    private readonly minioService: MinioClientService,
    @InjectRepository(Audio) private readonly audioRepo: Repository<Audio>,
  ) {}

  async create(
    title: string,
    genre: string,
    imageFile: Express.Multer.File | null,
    audioFile: Express.Multer.File,
  ) {
    const { filename: imageFilename } = imageFile
      ? await this.minioService.upload(imageFile)
      : this.minioService.getDefaultImage();

    const { filename: audioFilename } =
      await this.minioService.upload(audioFile);

    const audio = this.audioRepo.create({
      title,
      genre,
      imageFilename,
      audioFilename,
    });

    const createdAudio = await this.audioRepo.save(audio);

    return this.mapAudioToAudioDto(createdAudio);
  }

  async read({ offset, limit, order, pattern, filterBy }: ReadRecordsDto) {
    const [audios, count] = await this.audioRepo.findAndCount({
      where: pattern
        ? { title: Like(`%${pattern}%`), genre: filterBy }
        : { genre: filterBy },
      skip: offset ?? 0,
      take: limit ?? 10,
      order: { genre: order ?? 'ASC' },
    });

    const result = await Promise.all(
      audios.map((audio) => this.mapAudioToAudioDto(audio)),
    );
    return { result, count };
  }

  async readOne(id: number) {
    const audio = await this.audioRepo.findOne({ where: { id } });
    if (!audio) throw new NotFoundException();

    return this.mapAudioToAudioDto(audio);
  }

  async update(id: number, { title, genre }: UpdateRecordDto) {
    const audio = await this.audioRepo.findOne({ where: { id } });
    if (!audio) throw new NotFoundException();

    audio.title = title ?? audio.title;
    audio.genre = genre ?? audio.genre;
    const updatedAudio = await this.audioRepo.save(audio);

    return this.mapAudioToAudioDto(updatedAudio);
  }

  async delete(id: number) {
    const audio = await this.audioRepo.findOne({ where: { id } });
    if (!audio) throw new NotFoundException();

    const deletedAudio = await this.audioRepo.remove(audio);
    await this.minioService.delete(audio.imageFilename, audio.audioFilename);
    return this.mapAudioToAudioDto(deletedAudio);
  }

  private async mapAudioToAudioDto(audio: Audio): Promise<AudioDto> {
    return {
      ...omit(audio, ['imageFilename', 'audioFilename']),
      thumbnail: this.minioService.getFileUrl(audio.imageFilename),
      src: this.minioService.getFileUrl(audio.audioFilename),
    };
  }
}
