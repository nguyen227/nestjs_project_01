import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/configs/database/database.module';
import { RoleModule } from '../role/role.module';
import { UserController } from './user.controller';
import { UserProviders } from './user.provider';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, RoleModule, JwtModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, ...UserProviders],
  exports: [UserService],
})
export class UserModule {}
