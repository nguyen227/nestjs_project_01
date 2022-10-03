import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/configs/database/database.module';
import { FileModule } from 'src/services/files/file.module';
import { PermissionModule } from '../permission/permission.module';
import { RoleModule } from '../role/role.module';
import { UserControllerV1 } from './user.controller';
import { UserProviders } from './user.provider';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, RoleModule, JwtModule, FileModule, PermissionModule],
  controllers: [UserControllerV1],
  providers: [UserService, UserRepository, ...UserProviders],
  exports: [UserService],
})
export class UserModule {}
