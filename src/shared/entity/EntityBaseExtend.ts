import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class EntityBaseExtend {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;
}
