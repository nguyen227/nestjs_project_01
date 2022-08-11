import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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
    const userPermissions = await this.userService.getPermissionsNameByUserId(userId);
    // If user's permissions contain all required permissions, then allow access
    const allowAccess = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
    allowAccess
      ? Logger.log(
          `Required Permissions: ${requiredPermissions}, Allow access? ${allowAccess}`,
          'Guard',
        )
      : Logger.error(
          `Required Permissions: ${requiredPermissions}, Allow access? ${allowAccess}`,
          'Guard',
        );
    return allowAccess;
  }
}
