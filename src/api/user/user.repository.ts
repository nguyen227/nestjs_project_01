import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmRepository } from 'src/shared/database/typeorm.repository';
import { Repository } from 'typeorm';
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
}
