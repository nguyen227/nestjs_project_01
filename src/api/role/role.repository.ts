import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmRepository } from 'src/shared/database/typeorm.repository';
import { DataSource, Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleRepository extends TypeOrmRepository<Role> {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private roleRepo: Repository<Role>,
  ) {
    super(roleRepo);
  }
}
