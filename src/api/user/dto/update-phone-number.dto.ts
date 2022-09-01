import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class UpdatePhoneNumberDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phoneNumber: string;
}
