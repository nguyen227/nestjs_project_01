import { EntityBaseExtend } from 'src/shared/entity/EntityBaseExtend';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { FormStatus, FormType } from './form.enum';

export abstract class FormData {}

@Entity()
export class Form extends EntityBaseExtend {
  @Column(() => FormData)
  form_data: FormData;

  @Column({ type: 'enum', enum: FormType })
  type: FormType;

  @Column({ type: 'enum', enum: FormStatus, default: FormStatus.NEW })
  status: FormStatus;

  @Column({ default: '' })
  review: string;

  @ManyToOne(() => User, (user) => user.forms, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToOne(() => User, (user) => user.reviewForms)
  reviewer: User;
}
