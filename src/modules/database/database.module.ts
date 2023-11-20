import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import 'dotenv/config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ? String(process.env.DB_HOST) : 'localhost',
      port: 5432,
      database: 'audio_db',
      username: 'postgres',
      password: 'postgres',
      synchronize: true,
      uuidExtension: 'uuid-ossp',
      installExtensions: true,
      entities: [resolve(__dirname, '../../../dist/**/*.entity.js')],
    }),
  ],
})
export class DatabaseModule {}
