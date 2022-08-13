import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmRepository } from 'src/shared/database/typeorm.repository';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleRepository extends TypeOrmRepository<Role> {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private roleRepo: Repository<Role>,
  ) {
    super(roleRepo);
  }

  async findOneByWithRelations(key: FindOptionsWhere<Role>, relations: string[]) {
    return this.findOneWithRelations(key, relations);
  }
}
