import { Injectable } from '@nestjs/common';
import { Role } from './role.entity';
import { UserRole } from './role.enum';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private roleRepo: RoleRepository) {}

  async findOneById(id: string): Promise<Role> {
    return this.roleRepo.findOneBy({ id });
  }

  async findOneByRoleName(roleName: UserRole): Promise<Role> {
    return this.roleRepo.findOneBy({ roleName });
  }
}
