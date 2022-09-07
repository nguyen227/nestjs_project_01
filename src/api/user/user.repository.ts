import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmRepository } from '../../shared/database/typeorm.repository';
import { Repository, TreeRepository } from 'typeorm';
import { Role } from '../role/role.entity';
import { User } from './user.entity';
import { USER_REPO, USER_TREE_REPO } from './user.constant';

@Injectable()
export class UserRepository extends TypeOrmRepository<User> {
  constructor(
    @Inject(USER_REPO)
    public userRepo: Repository<User>,

    @Inject(USER_TREE_REPO)
    private userTreeRepo: TreeRepository<User>,
  ) {
    super(userRepo);
  }

  async findPasswordById(id: number): Promise<string> {
    const userWithPassword = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();
    return userWithPassword.password;
  }

  async findRolesById(id: number): Promise<Role[]> {
    const user = await this.findOne({ id }, { roles: true });
    return user.roles;
  }

  async findRolesNameById(id: number): Promise<string[]> {
    const user = await this.findOne({ id }, { roles: true });
    const listRoles = [...new Set(user.roles.map((role) => role.roleName))];
    return listRoles;
  }

  async findUsersManageList(id: number): Promise<User[]> {
    const userFound = await this.userRepo.findOneBy({ id });
    const tree = await this.userTreeRepo.findDescendantsTree(userFound, { depth: 1 });
    return tree.manage;
  }

  async findUserManager(id: number): Promise<User> {
    const userFound = await this.userRepo.findOneBy({ id });
    const tree = await this.userTreeRepo.findAncestorsTree(userFound, { depth: 1 });
    return tree.manager;
  }

  async findUserTree(): Promise<User[]> {
    const tree = await this.userTreeRepo.findTrees();
    return tree;
  }
}
