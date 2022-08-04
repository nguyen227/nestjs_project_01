import { EntityBaseExtend } from 'src/shared/entity/EntityBaseExtend';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Role } from '../role/role.entity';
import { RolePermission } from './permission.enum';

@Entity()
export class Permission extends EntityBaseExtend {
  @Column({ type: 'enum', enum: RolePermission })
  name: RolePermission;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
