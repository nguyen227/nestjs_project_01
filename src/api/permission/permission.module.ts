import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/configs/database/database.module';
import { PermissionProviders } from './permission.provider';
import { PermissionRepository } from './permission.repository';
import { PermissionService } from './permission.service';

@Module({
  imports: [DatabaseModule],
  providers: [PermissionService, PermissionRepository, ...PermissionProviders],
  exports: [PermissionService],
})
export class PermissionModule {}
