import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/configs/database/database.module';
import { RoleProviders } from './role.provider';
import { RoleRepository } from './role.repository';
import { RoleService } from './role.service';

@Module({
  imports: [DatabaseModule],
  providers: [RoleService, RoleRepository, ...RoleProviders],
  exports: [RoleService],
})
export class RoleModule {}
