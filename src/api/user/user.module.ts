import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/configs/database/database.module';
import { RoleModule } from '../role/role.module';
import { UserController } from './user.controller';
import { UserProviders } from './user.provider';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, ConfigModule, RoleModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, ...UserProviders],
  exports: [UserService],
})
export class UserModule {}
