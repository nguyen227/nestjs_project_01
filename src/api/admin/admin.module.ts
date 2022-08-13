import { Module } from '@nestjs/common';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { AdminController } from './admin.controller';

@Module({ imports: [UserModule, RoleModule], controllers: [AdminController] })
export class AdminModule {}
