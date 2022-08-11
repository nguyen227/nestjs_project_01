import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmRepository } from 'src/shared/database/typeorm.repository';
import { Repository, TreeRepository } from 'typeorm';
import { Role } from '../role/role.entity';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends TypeOrmRepository<User> {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepo: Repository<User>,

    @Inject('USER_TREE_REPO')
    private userTreeRepo: TreeRepository<User>,
  ) {
    super(userRepo);
  }

  async getPasswordById(id: number): Promise<User> {
    return await this.userRepo
      .createQueryBuilder('user')
      .select('user.password', 'password')
      .where('user.id = :id', { id })
      .getRawOne();
  }

  async findRolesById(id: number): Promise<Role[]> {
    const user = await this.userRepo.findOne({
      relations: { roles: true },
      where: { id },
    });

    return user.roles;
  }

  async findRolesNameById(id: number): Promise<string[]> {
    const user = await this.userRepo.findOne({
      relations: { roles: true },
      where: { id },
    });
    const listRoles = [...new Set(user.roles.map((role) => role.roleName))];
    return listRoles;
  }

  async findPermissionsNameById(id: number): Promise<string[]> {
    const user = await this.userRepo.findOne({
      relations: {
        roles: {
          permissions: true,
        },
      },
      where: { id },
    });
    const userPermissions = user.roles.flatMap((role) => role.permissions);
    const listPermissions = [...new Set(userPermissions.map((permission) => permission.name))]; // distinct permissions
    return listPermissions;
  }
  async getUsersMangageList(id: number): Promise<User[]> {
    const userFound = await this.userRepo.findOneBy({ id });
    const tree = await this.userTreeRepo.findDescendantsTree(userFound, { depth: 1 });
    return tree.manage;
  }

  async getUserManager(id: number): Promise<User> {
    const userFound = await this.userRepo.findOneBy({ id });
    const tree = await this.userTreeRepo.findAncestorsTree(userFound, { depth: 1 });
    return tree.manager;
  }

  async getUserTree(): Promise<User[]> {
    const tree = await this.userTreeRepo.findTrees();
    return tree;
  }
}
