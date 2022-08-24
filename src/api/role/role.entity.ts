import { EntityBaseExtend } from 'src/shared/entity/EntityBaseExtend';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Permission } from '../permission/permission.entity';
import { User } from '../user/user.entity';
import { ROLES } from './role.enum';

@Entity()
export class Role extends EntityBaseExtend {
  @Column({ type: 'enum', enum: ROLES })
  roleName: ROLES;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  permissions: Permission[];
}
