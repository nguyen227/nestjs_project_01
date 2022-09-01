import { DataSource } from 'typeorm';
import { USER_REPO, USER_TREE_REPO } from './user.constant';
import { User } from './user.entity';

export const UserProviders = [
  {
    provide: USER_REPO,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: USER_TREE_REPO,
    useFactory: (dataSource: DataSource) => dataSource.getTreeRepository(User),
    inject: ['DATA_SOURCE'],
  },
];
