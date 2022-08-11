import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export abstract class Name {
  @ApiProperty()
  @Column({ length: 20 })
  first: string;

  @ApiProperty()
  @Column({ length: 20 })
  last: string;
}
