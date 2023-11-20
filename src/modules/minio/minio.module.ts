import { Module, Global } from '@nestjs/common';
import { NestMinioModule } from 'nestjs-minio';
import { MinioClientService } from './services/minio.service';
import { MINIO_HOST } from 'src/constants/constants';

@Global()
@Module({
  imports: [
    NestMinioModule.register({
      isGlobal: true,
      endPoint: MINIO_HOST,
      port: 9000,
      useSSL: false,
      accessKey: 'admin',
      secretKey: '123456789',
    }),
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
export { MINIO_HOST };
