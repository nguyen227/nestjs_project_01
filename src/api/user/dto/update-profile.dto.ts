import {
  IsEmail,
  IsIdentityCard,
  IsNumberString,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Name } from 'src/shared/entity/NameExtend';

export class UpdateProfileDto {
  @IsObject({ message: "provide name like 'name': {first: string, last: string}" })
  @IsOptional()
  name?: Name;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIdentityCard()
  idCardNumber?: string;

  @IsOptional()
  @IsNumberString()
  socialInsuranceCode?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  username?: string;
}
