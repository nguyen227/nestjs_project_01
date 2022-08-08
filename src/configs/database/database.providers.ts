import { ConfigService } from '@nestjs/config';
import { Form } from 'src/api/form/form.entity';
import { Permission } from 'src/api/permission/permission.entity';
import { Role } from 'src/api/role/role.entity';
import { User } from 'src/api/user/user.entity';
import { DataSource } from 'typeorm';
import { MysqlConfig } from '../interfaces/mysqlConfig.interface';

export const databaseProviders = [
  {
    inject: [ConfigService],
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const MYSQL_CONFIG = configService.get<MysqlConfig>('mysql_config');
      const dataSource = new DataSource({
        type: 'mysql',
        ...MYSQL_CONFIG,
        entities: [User, Role, Permission, Form],
        synchronize: true,
      });
      return dataSource.initialize();
    },
  },
];
