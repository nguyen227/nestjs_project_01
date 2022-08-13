import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmRepository } from 'src/shared/database/typeorm.repository';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionRepository extends TypeOrmRepository<Permission> {
  constructor(
    @Inject('PERMISSION_REPOSITORY')
    private permissionRepo: Repository<Permission>,
  ) {
    super(permissionRepo);
  }
}
