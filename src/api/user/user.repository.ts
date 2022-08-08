import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmRepository } from 'src/shared/database/typeorm.repository';
import { DataSource, Repository, TreeRepository } from 'typeorm';
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

  async getUserRolesByUserId(id: number): Promise<User[]> {
    return await this.userRepo
      .createQueryBuilder('user')
      .select('user.id')
      .leftJoinAndSelect('user.roles', 'role')
      .where('user.id = :id', { id })
      .getMany();
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
}
