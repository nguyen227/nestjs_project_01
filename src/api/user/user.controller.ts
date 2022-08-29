import { Body, Controller, Get, Put, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HasPermissions, HasRoles } from '../../shared/decorators';
import { PERMISSIONS } from '../permission/permission.enum';
import { ROLES } from '../role/role.enum';
import { UpdateProfileDto } from './dto';
import { User } from './user.entity';
import { UserService } from './user.service';
@HasRoles(ROLES.EMPLOYEE)
@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HasRoles(ROLES.ADMIN)
  @HasPermissions(PERMISSIONS.UDPATE_PROFILE)
  @ApiOperation({ summary: 'Get infor of all user' })
  public getAllUser(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get('/profile')
  @HasPermissions(PERMISSIONS.READ_PROFILE)
  @ApiOperation({ summary: 'View own profile' })
  public readOwnProfile(@Request() req: any): Promise<User> {
    return this.userService.readOwnProfile(req.user.id);
  }

  @Put('/profile')
  @HasPermissions(PERMISSIONS.UDPATE_PROFILE)
  @ApiOperation({ summary: 'Update profile' })
  public udpateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    return this.userService.updateProfile(req.user.id, updateProfileDto);
  }

  @Get('/roles')
  @ApiOperation({ summary: 'View own roles' })
  public getUserRole(@Request() req: any): Promise<string[]> {
    return this.userService.getRolesNameByUserId(req.user.id);
  }

  @Get('/permissions')
  @ApiOperation({ summary: 'View own permissions' })
  public getUserPermissions(@Request() req: any): Promise<string[]> {
    return this.userService.getPermissionsNameByUserId(req.user.id);
  }

  @Get('/manage')
  @HasPermissions(PERMISSIONS.READ_PROFILE)
  @ApiOperation({ summary: 'View employees under management' })
  public getUsersManage(@Request() req: any): Promise<User[]> {
    return this.userService.getUsersManageList(req.user.userId);
  }

  @Put('/avatar')
  @HasPermissions(PERMISSIONS.UDPATE_PROFILE)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  public uploadAvatar(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.userService.updateAvatar(req.user.id, file);
  }
}
