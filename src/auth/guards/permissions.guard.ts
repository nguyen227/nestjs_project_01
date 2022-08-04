import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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

    const authUser = await this.userService.findOneById(userId);
    const userPermissions_maybeDuplicate = authUser.roles.flatMap((role) => role.permissions);
    const userPermissions_notDuplicate = [
      ...new Set(userPermissions_maybeDuplicate.map((permission) => permission.name)),
    ];
    // If user's permissions contain all required permissions, then allow access
    return requiredPermissions.every((permission) =>
      userPermissions_notDuplicate.includes(permission),
    );
  }
}
