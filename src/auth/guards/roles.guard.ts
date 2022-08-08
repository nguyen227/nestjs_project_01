import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';
import { UserRole } from '../../api/role/role.enum';
import { UserService } from 'src/api/user/user.service';
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
    const authUser = await this.userService.findOneById(userId);
    const userRoles = (await authUser.roles).map((role) => role.roleName);

    // If user roles contain at least one role in required roles, then allow access
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
