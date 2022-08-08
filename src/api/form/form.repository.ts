import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmRepository } from 'src/shared/database/typeorm.repository';
import { Repository } from 'typeorm';
import { Form } from './form.entity';

@Injectable()
export class FormRepository extends TypeOrmRepository<Form> {
  constructor(
    @Inject('FORM_REPOSITORY')
    private formRepo: Repository<Form>,
  ) {
    super(formRepo);
  }
}
