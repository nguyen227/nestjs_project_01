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

  async findRefreshTokenById(id: number): Promise<string> {
    const userWithRefreshToken = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.refreshToken')
      .where('user.id = :id', { id })
      .getOne();
    return userWithRefreshToken.refreshToken;
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

  async findUsersManageList(userId: number) {
    const userFound1 = await this.userRepo
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .select([
        'user.id',
        'manage.id',
        'manage.username',
        'manage.firstName',
        'manage.lastName',
        'manage.email',
      ])
      .leftJoin('user.manage', 'manage')
      .getOne();
    return userFound1.manage;
  }

  async findUserManager(id: number) {
    const userFound = await this.userRepo
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .select([
        'user.id',
        'manager.id',
        'manager.username',
        'manager.firstName',
        'manager.lastName',
        'manager.email',
      ])
      .leftJoin('user.manager', 'manager')
      .getOne();
    return userFound.manager;
  }

  async findUserTree(): Promise<User[]> {
    const tree = await this.userTreeRepo.findTrees();
    return tree;
  }
}
