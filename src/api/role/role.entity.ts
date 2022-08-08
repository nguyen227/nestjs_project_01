import { EntityBaseExtend } from 'src/shared/entity/EntityBaseExtend';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Permission } from '../permission/permission.entity';
import { User } from '../user/user.entity';
import { UserRole } from './role.enum';

@Entity()
export class Role extends EntityBaseExtend {
  @Column({ type: 'enum', enum: UserRole })
  roleName: UserRole;

  @ManyToMany(() => User, (user) => user.roles)
  users: Promise<User[]>;

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  permissions: Promise<Permission[]>;
}
