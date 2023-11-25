import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ORDERS } from 'src/constants/constants';

export type Order = (typeof ORDERS)[number];

export class CreateRecordDto {
  @ApiProperty({ type: String, required: true, example: 'file title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String, required: true, example: 'POP' })
  @IsString()
  @IsNotEmpty()
  genre: string;
}

export class UpdateRecordDto extends PartialType(CreateRecordDto) {}

export class RecordIdDto {
  @ApiProperty({ type: Number, required: true, example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;
}

export class ReadRecordsDto {
  @ApiProperty({ type: Number, required: false, example: '0' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number | null;

  @ApiProperty({ type: Number, required: false, example: '100' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number | null;

  @ApiProperty({
    type: String,
    required: false,
    description: 'ASC or DESC',
  })
  @IsOptional()
  @IsString()
  @IsIn(ORDERS)
  order?: Order | null;
}

export class AudioDto {
  @ApiProperty({ type: Number, required: true, example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ type: String, required: true, example: 'file title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String, required: true, example: 'POP' })
  @IsString()
  @IsNotEmpty()
  genre: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  src: string;
}

export class PaginatedResponseDto {
  @IsArray()
  result: AudioDto[];

  @IsInt()
  @Min(0)
  count: number;
}
