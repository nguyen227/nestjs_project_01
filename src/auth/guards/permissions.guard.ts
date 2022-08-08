import { CanActivate, ConsoleLogger, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Logger } from 'mongodb';
import { Permission } from 'src/api/permission/permission.entity';
import { RolePermission } from 'src/api/permission/permission.enum';
import { UserService } from 'src/api/user/user.service';
import { PERMISSIONS_KEY } from '../decorators';
import { JwtPayload } from '../interfaces';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<RolePermission[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );
    if (!requiredPermissions) return true;
    const jwtPayload: JwtPayload = context.switchToHttp().getRequest().user;
    const { userId } = jwtPayload;

    const authUser = await this.userService.findOneById(userId);
    const userRoles = await authUser.roles;

    const rolesPermissions: Permission[] = [];
    for await (const role of userRoles) {
      const permissions = await role.permissions;
      rolesPermissions.push(...permissions);
    }
    const userPermissions = new Set(rolesPermissions.map((permission) => permission.name));

    // If user's permissions contain all required permissions, then allow access
    console.log(userPermissions, requiredPermissions);
    return requiredPermissions.every((permission) => userPermissions.has(permission));
  }
}
