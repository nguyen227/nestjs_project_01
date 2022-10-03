import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class UpdatePhoneNumberDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'Must begin with +84, not 0' })
  phoneNumber: string;
}
