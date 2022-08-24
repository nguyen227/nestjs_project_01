import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmRepository } from 'src/shared/database/typeorm.repository';
import { FindManyOptions, Repository } from 'typeorm';
import { Form } from './form.entity';

@Injectable()
export class FormRepository extends TypeOrmRepository<Form> {
  constructor(
    @Inject('FORM_REPOSITORY')
    private formRepo: Repository<Form>,
  ) {
    super(formRepo);
  }

  async findByUserId(userId: number, status: string): Promise<Form[]> {
    const conditions: FindManyOptions = {
      relations: {
        reviewer: true,
        owner: true,
      },
      where: {
        owner: {
          id: userId,
        },
        status,
      },
      select: {
        reviewer: {
          username: true,
        },
        owner: {},
      },
    };
    return this.formRepo.find(conditions);
  }

  async findByConditions(conditions: any): Promise<Form[]> {
    return this.formRepo.find(conditions);
  }

  async findByConditionsAndCount(conditions: any): Promise<[Form[], number]> {
    return this.formRepo.findAndCount(conditions);
  }

  async findOneById(id: number): Promise<Form> {
    return this.findOne({ id });
  }
}
