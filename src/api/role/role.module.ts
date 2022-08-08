import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/configs/database/database.module';
import { RoleController } from './role.controller';
import { RoleProviders } from './role.provider';
import { RoleRepository } from './role.repository';
import { RoleService } from './role.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository, ...RoleProviders],
  exports: [RoleService],
})
export class RoleModule {}
