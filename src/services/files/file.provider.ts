import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { File } from './file.entity';

export const FileProviders: Provider[] = [
  {
    provide: 'FILE_REPO',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(File),
    inject: ['DATA_SOURCE'],
  },
];
