import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import to from 'await-to-js';
import { randomUUID } from 'crypto';
import { Client } from 'minio';
import { InjectMinio } from 'nestjs-minio';
import { join } from 'path';
import {
  BUCKET,
  DEFAULT_IMAGE_NAME,
  ALLOWED_MIME_TYPES,
} from 'src/constants/constants';

@Injectable()
export class MinioClientService implements OnModuleInit {
  private defaultImageUrl: string;
  constructor(@InjectMinio() private readonly client: Client) {}

  async onModuleInit() {
    const fileExists = await this.client
      .statObject(BUCKET, DEFAULT_IMAGE_NAME)
      .then(
        () => true,
        () => false,
      );

    if (!fileExists) {
      await this.client.fPutObject(
        BUCKET,
        DEFAULT_IMAGE_NAME,
        join('assets', DEFAULT_IMAGE_NAME),
      );
    }

    this.defaultImageUrl = this.getFileUrl(DEFAULT_IMAGE_NAME);
  }

  public getDefaultImage() {
    return {
      url: this.defaultImageUrl,
      filename: DEFAULT_IMAGE_NAME,
    };
  }

  public async upload(file: Express.Multer.File) {
    if (!ALLOWED_MIME_TYPES.some((type) => file.mimetype.includes(type))) {
      throw new BadRequestException('Invalid file type');
    }

    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );

    const filename = randomUUID() + ext;

    const fileBuffer = file.buffer;
    const [err] = await to(
      this.client.putObject(BUCKET, filename, fileBuffer, file.size, {
        'content-type': file.mimetype,
        originalname: file.originalname,
        mimetype: file.mimetype,
      }),
    );
    if (err) {
      throw new BadRequestException('Error uploading file');
    }

    const url = this.getFileUrl(filename);
    return {
      url,
      filename,
    };
  }

  getFileUrl(filename: string) {
    return `http://localhost:9000/${BUCKET}/${filename}`;
  }

  async delete(imageFile: string, audioFile: string) {
    try {
      await this.client.removeObject(BUCKET, audioFile);
      if (imageFile !== DEFAULT_IMAGE_NAME) {
        await this.client.removeObject(BUCKET, imageFile);
      }
    } catch (e) {
      throw new BadRequestException('Error deleting file ' + e);
    }
  }
}
