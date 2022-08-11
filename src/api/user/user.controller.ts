import { Body, Controller, Get, Put, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HasPermissions, HasRoles } from 'src/auth/decorators';
import { RolePermission } from '../permission/permission.enum';
import { UserRole } from '../role/role.enum';
import { UpdateProfileDto } from './dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@HasRoles(UserRole.EMPLOYEE)
@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HasRoles(UserRole.ADMIN)
  @HasPermissions(RolePermission.UDPATE_PROFILE)
  @ApiOperation({ summary: 'Get infor of all user' })
  public getAllUser(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/profile')
  @HasPermissions(RolePermission.READ_PROFILE)
  @ApiOperation({ summary: 'View own profile' })
  public readOwnProfile(@Request() req: any): Promise<User> {
    return this.userService.readOwnProfile(req.user.userId);
  }

  @Put('/profile')
  @HasPermissions(RolePermission.UDPATE_PROFILE)
  @ApiOperation({ summary: 'Update profile' })
  public udpateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    return this.userService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Get('/roles')
  @ApiOperation({ summary: 'View own roles' })
  public getUserRole(@Request() req: any): Promise<string[]> {
    return this.userService.getRolesNameByUserId(req.user.userId);
  }

  @Get('/permissions')
  @ApiOperation({ summary: 'View own permissions' })
  public getUserPermissions(@Request() req: any): Promise<string[]> {
    return this.userService.getPermissionsNameByUserId(req.user.userId);
  }

  @Get('/manage')
  @HasPermissions(RolePermission.READ_PROFILE)
  @ApiOperation({ summary: 'View employees under management' })
  public getUsersManage(@Request() req: any): Promise<User[]> {
    return this.userService.getUsersMangageList(req.user.userId);
  }
}
