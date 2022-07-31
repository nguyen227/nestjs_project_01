import { Column } from 'typeorm';

export abstract class Name {
  @Column({ length: 20 })
  first: string;

  @Column({ length: 20 })
  last: string;
}
