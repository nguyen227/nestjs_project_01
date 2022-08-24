import { ConflictException, Injectable } from '@nestjs/common';
import { PermissionService } from '../permission/permission.service';
import { UpdateRolePermissionDto } from './dto';
import { Role } from './role.entity';
import { ROLES } from './role.enum';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private roleRepo: RoleRepository, private permissionService: PermissionService) {}

  async findOneById(id: number): Promise<Role> {
    return this.roleRepo.findOne({ id });
  }

  async findOneByRoleName(roleName: ROLES): Promise<Role> {
    return this.roleRepo.findOne({ roleName });
  }

  async getAllRole(): Promise<Role[]> {
    return this.roleRepo.find({});
  }

  async addRolePermission(updateRolePermissionDto: UpdateRolePermissionDto) {
    const { roleName, permissionName } = updateRolePermissionDto;
    const roleFound = await this.roleRepo.findOne({ roleName }, { permissions: true });

    const permissionFound = await this.permissionService.findOneByName(permissionName);

    const rolePermissions = roleFound.permissions.map((permission) => permission.name);
    if (rolePermissions.includes(permissionFound.name))
      throw new ConflictException(`role ${roleName} already have ${permissionName} permission`);
    roleFound.permissions.push(permissionFound);

    return this.roleRepo.save(roleFound);
  }

  async deleteRolePermission(updateRolePermissionDto: UpdateRolePermissionDto) {
    const { roleName, permissionName } = updateRolePermissionDto;
    const roleFound = await this.roleRepo.findOne({ roleName }, { permissions: true });

    // const permissionFound = await this.permissionService.findOneByName(permissionName);

    roleFound.permissions.filter((permission) => permission.name !== permissionName);

    return this.roleRepo.save(roleFound);
  }
}
