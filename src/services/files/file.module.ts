import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/configs/database/database.module';
import { FileProviders } from './file.provider';
import { FileService } from './file.service';

@Module({
  imports: [DatabaseModule],
  providers: [FileService, ...FileProviders],
  exports: [FileService],
})
export class FileModule {}
