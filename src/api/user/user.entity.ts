import { EntityBaseExtend } from 'src/shared/entity/EntityBaseExtend';
import { Name } from 'src/shared/entity/NameExtend';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends EntityBaseExtend {
  @Column(() => Name)
  name: Name;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;
}
