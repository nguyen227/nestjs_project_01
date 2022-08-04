import { EntityBaseExtend } from 'src/shared/entity/EntityBaseExtend';
import { Name } from 'src/shared/entity/NameExtend';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Role } from '../role/role.entity';

@Entity()
export class User extends EntityBaseExtend {
  @Column({ type: 'bigint', default: null })
  userID: number;

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

  @ManyToMany(() => Role, (role) => role.users, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  @JoinTable()
  roles: Role[];
}
