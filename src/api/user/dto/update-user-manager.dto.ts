import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class UpdateUserManager {
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @IsNumber()
  @Type(() => Number)
  managerId: number;
}
