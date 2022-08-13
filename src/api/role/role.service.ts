import { ConflictException, Injectable } from '@nestjs/common';
import { PermissionService } from '../permission/permission.service';
import { UpdateRolePermissionDto } from './dto';
import { Role } from './role.entity';
import { UserRole } from './role.enum';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private roleRepo: RoleRepository, private permissionService: PermissionService) {}

  async findOneById(id: number): Promise<Role> {
    return this.roleRepo.findOneBy({ id });
  }

  async findOneByRoleName(roleName: UserRole): Promise<Role> {
    return this.roleRepo.findOneBy({ roleName });
  }

  async getAllRole(): Promise<Role[]> {
    return this.roleRepo.find({});
  }

  async addRolePermission(updateRolePermissionDto: UpdateRolePermissionDto) {
    const { roleName, permissionName } = updateRolePermissionDto;
    const roleFound = await this.roleRepo.findOneWithRelations({ roleName }, ['permissions']);

    const permissionFound = await this.permissionService.findOneByName(permissionName);

    const rolePermissions = roleFound.permissions.map((permission) => permission.name);
    if (rolePermissions.includes(permissionFound.name))
      throw new ConflictException(`role ${roleName} already have ${permissionName} permission`);
    roleFound.permissions.push(permissionFound);

    return roleFound.save();
  }

  async deleteRolePermission(updateRolePermissionDto: UpdateRolePermissionDto) {
    const { roleName, permissionName } = updateRolePermissionDto;
    const roleFound = await this.roleRepo.findOneWithRelations({ roleName }, ['permissions']);

    const permissionFound = await this.permissionService.findOneByName(permissionName);

    roleFound.permissions.filter((permission) => permission.name !== permissionName);

    return roleFound.save();
  }
}
