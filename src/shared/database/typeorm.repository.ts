import { BaseEntity, DeepPartial, Repository } from 'typeorm';

export class TypeOrmRepository<T extends BaseEntity> {
  constructor(private baseRepo: Repository<T>) {}

  create(data: DeepPartial<T>): T {
    return this.baseRepo.create(data);
  }

  async findBy(conditions: any): Promise<T[]> {
    return this.baseRepo.find(conditions);
  }

  async findOneBy(condition: any): Promise<T> {
    return await this.baseRepo.findOneBy(condition);
  }
}
