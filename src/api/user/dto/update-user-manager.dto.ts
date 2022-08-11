import { IsNumber } from 'class-validator';

export class UpdateUserManager {
  @IsNumber()
  userId: number;

  @IsNumber()
  managerId: number;
}
