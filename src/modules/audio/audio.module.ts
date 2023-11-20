import { Module } from '@nestjs/common';
import { AudioController } from './controllers/audio.controller';
import { AudioService } from './services/audio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audio } from './entities/audio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Audio])],
  controllers: [AudioController],
  providers: [AudioService],
})
export class AudioModule {}
