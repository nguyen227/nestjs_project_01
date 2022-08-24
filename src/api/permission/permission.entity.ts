import { EntityBaseExtend } from 'src/shared/entity/EntityBaseExtend';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Role } from '../role/role.entity';
import { PERMISSIONS } from './permission.enum';

@Entity()
export class Permission extends EntityBaseExtend {
  @Column({ type: 'enum', enum: PERMISSIONS })
  name: PERMISSIONS;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
