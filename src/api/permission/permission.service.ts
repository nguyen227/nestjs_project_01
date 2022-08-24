import { Injectable } from '@nestjs/common';
import { Permission } from './permission.entity';
import { PERMISSIONS } from './permission.enum';
import { PermissionRepository } from './permission.repository';

@Injectable()
export class PermissionService {
  constructor(private permissionRepo: PermissionRepository) {}

  async findOneByName(name: PERMISSIONS): Promise<Permission> {
    return this.permissionRepo.findOne({ name });
  }
}
