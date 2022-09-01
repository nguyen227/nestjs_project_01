import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  ObjectID,
  Repository,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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

  async update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    return this.baseRepo.update(criteria, partialEntity);
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

  async findPagination(
    pagiOptions: IPaginationOptions,
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    select?: FindOptionsSelect<T>,
  ): Promise<Pagination<T>> {
    return paginate<T>(this.baseRepo, pagiOptions, { where, relations, select });
  }
}
