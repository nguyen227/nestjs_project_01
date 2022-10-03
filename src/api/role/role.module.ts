import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/configs/database/database.module';
import { PermissionModule } from '../permission/permission.module';
import { RoleControllerV1 } from './role.controller';
import { RoleProviders } from './role.provider';
import { RoleRepository } from './role.repository';
import { RoleService } from './role.service';

@Module({
  imports: [DatabaseModule, PermissionModule],
  controllers: [RoleControllerV1],
  providers: [RoleService, RoleRepository, ...RoleProviders],
  exports: [RoleService],
})
export class RoleModule {}
