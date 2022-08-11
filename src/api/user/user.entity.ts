import { EntityBaseExtend } from 'src/shared/entity/EntityBaseExtend';
import { Name } from 'src/shared/entity/NameExtend';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Form } from '../form/form.entity';
import { Role } from '../role/role.entity';
import { UserType } from './user.constant';

@Entity()
@Tree('materialized-path')
export class User extends EntityBaseExtend {
  @Column(() => Name)
  name: Name;

  @Column({ unique: true, default: null })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: null })
  avatar: string;

  @Column({ default: null })
  idCardNumber: string;

  @Column({ default: null })
  socialInsuranceCode: string;

  @Column({ default: null })
  address: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.PROBATIONARY })
  type: UserType;

  @ManyToMany(() => Role, (role) => role.users, {
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  roles: Role[];

  @TreeParent()
  manager: User;

  @TreeChildren()
  manage: User[];

  @OneToMany(() => Form, (form) => form.owner)
  forms: Form[];

  @OneToMany(() => Form, (form) => form.reviewer)
  reviewForms: Form[];
}
