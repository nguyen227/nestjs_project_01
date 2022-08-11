import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/api/user/user.service';
import { UserRole } from '../../api/role/role.enum';
import { ROLES_KEY } from '../decorators';
import { JwtPayload } from '../interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const jwtPayload: JwtPayload = context.switchToHttp().getRequest().user;
    const { userId } = jwtPayload;
    const userRoles = await this.userService.getRolesNameByUserId(userId);

    // If user roles contain at least one role in required roles, then allow access
    const allowAccess = requiredRoles.some((role) => userRoles.includes(role));
    allowAccess
      ? Logger.log(`Required Roles: ${requiredRoles}, Allow access? ${allowAccess}`, 'Guard')
      : Logger.error(`Required Roles: ${requiredRoles}, Allow access? ${allowAccess}`, 'Guard');
    return allowAccess;
  }
}
