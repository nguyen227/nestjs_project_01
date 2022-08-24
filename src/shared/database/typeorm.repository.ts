import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

export class TypeOrmRepository<T> {
  constructor(private baseRepo: Repository<T>) {}

  create(data: DeepPartial<T>): T {
    return this.baseRepo.create(data);
  }

  async save(entity: T): Promise<T> {
    return this.baseRepo.save(entity);
  }

  async remove(entity: T): Promise<T> {
    return this.baseRepo.remove(entity);
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    select?: FindOptionsSelect<T>,
  ): Promise<T> {
    return this.baseRepo.findOne({ where, relations, select });
  }

  async find(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    select?: FindOptionsSelect<T>,
  ): Promise<T[]> {
    return this.baseRepo.find({ where, relations, select });
  }
}
