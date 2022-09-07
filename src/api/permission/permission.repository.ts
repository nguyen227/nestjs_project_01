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

  async findPermisisonsByUserId(id: number): Promise<Permission[]> {
    return this.permissionRepo.query(
      'select distinct p.* from user u left join user_roles_role ur on ur.userId = u.id left join role r on r.id = ur.roleId left join role_permissions_permission rp on r.id = rp.roleId left join permission p on p.id = rp.permissionId where u.id =? order by id asc',
      [id],
    );
  }
}
