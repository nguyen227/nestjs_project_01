import { MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @MinLength(6)
  @MaxLength(20)
  oldPassword: string;

  @MinLength(6)
  @MaxLength(20)
  newPassword: string;
}
