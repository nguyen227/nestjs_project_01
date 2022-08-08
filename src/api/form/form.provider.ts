import { DataSource } from 'typeorm';
import { Form } from './form.entity';

export const FormProviders = [
  {
    provide: 'FORM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Form),
    inject: ['DATA_SOURCE'],
  },
];
