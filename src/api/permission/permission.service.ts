import { Injectable } from '@nestjs/common';
import { Permission } from './permission.entity';
import { RolePermission } from './permission.enum';
import { PermissionRepository } from './permission.repository';

@Injectable()
export class PermissionService {
  constructor(private permissionRepo: PermissionRepository) {}

  async findOneByName(name: RolePermission): Promise<Permission> {
    return this.permissionRepo.findOneBy({ name });
  }
}
