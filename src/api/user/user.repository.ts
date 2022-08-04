import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmRepository } from 'src/shared/database/typeorm.repository';
import { Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends TypeOrmRepository<User> {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepo: Repository<User>,
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
}
