import { Module } from '@nestjs/common';
import { AudioModule } from './modules/audio/audio.module';
import { DatabaseModule } from './modules/database/database.module';
import { MinioClientModule } from './modules/minio/minio.module';

@Module({
  imports: [DatabaseModule, AudioModule, MinioClientModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
