import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AudioService } from '../services/audio.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  AudioDto,
  CreateRecordDto,
  PaginatedResponseDto,
  ReadRecordsDto,
  RecordIdDto,
  UpdateRecordDto,
} from '../types/types';
import { CATEGORIES, CATS } from 'src/constants/constants';

@ApiTags('Audio')
@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data') // Specify the content type for Swagger
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', nullable: false },
        genre: { enum: CATS, nullable: false, examples: CATEGORIES },
        image: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
        audio: {
          type: 'string',
          format: 'binary',
          nullable: false,
        },
      },
    },
  })
  @ApiResponse({ type: AudioDto })
  create(
    @UploadedFiles() files: Express.Multer.File,
    @Body() { title, genre }: CreateRecordDto,
  ): Promise<AudioDto> {
    if (!files['audio']) throw new BadRequestException('Audio file required');
    if (!files['audio'][0].mimetype.includes('mpeg'))
      throw new BadRequestException(
        'Invalid audio file format, should be .mp3',
      );

    if (files['image']) {
      if (
        !files['image'][0].mimetype.includes('jpeg') &&
        !files['image'][0].mimetype.includes('png')
      )
        throw new BadRequestException(
          'Invalid image file format, should be .jpeg or .png',
        );
    }

    const imageFile = files['image'] ? files['image'][0] : null;
    const audioFile = files['audio'][0];

    return this.audioService.create(title, genre, imageFile, audioFile);
  }

  @ApiResponse({ type: PaginatedResponseDto })
  @Get()
  read(@Query() data: ReadRecordsDto): Promise<PaginatedResponseDto> {
    return this.audioService.read(data);
  }

  @ApiResponse({ type: AudioDto })
  @Get(':id')
  readOne(@Param() { id }: RecordIdDto): Promise<AudioDto> {
    return this.audioService.readOne(id);
  }

  @ApiResponse({ type: AudioDto })
  @Delete(':id')
  delete(@Param() { id }: RecordIdDto): Promise<AudioDto> {
    return this.audioService.delete(id);
  }

  @ApiResponse({ type: AudioDto })
  @Patch(':id')
  update(
    @Param() { id }: RecordIdDto,
    @Body() data: UpdateRecordDto,
  ): Promise<AudioDto> {
    return this.audioService.update(id, data);
  }
}
