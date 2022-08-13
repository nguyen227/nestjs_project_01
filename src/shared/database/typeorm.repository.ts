import {
  BaseEntity,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

export class TypeOrmRepository<T extends BaseEntity> {
  constructor(private baseRepo: Repository<T>) {}

  create(data: DeepPartial<T>): T {
    return this.baseRepo.create(data);
  }

  async find(conditions: FindManyOptions): Promise<T[]> {
    return this.baseRepo.find(conditions);
  }

  async findOne(condition: FindOneOptions): Promise<T> {
    return await this.baseRepo.findOne(condition);
  }

  async findBy(condition: FindOptionsWhere<T>): Promise<T[]> {
    return this.baseRepo.findBy(condition);
  }

  async findOneBy(condition: FindOptionsWhere<T>): Promise<T> {
    return await this.baseRepo.findOneBy(condition);
  }

  async findOneWithRelations(key: FindOptionsWhere<T>, relationsList: string[]): Promise<T> {
    const relations = {};
    relationsList.forEach((element) => {
      relations[element] = true;
    });
    return this.findOne({ where: key, relations });
  }
}
