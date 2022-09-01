import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Name } from 'src/shared/entity/NameExtend';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsObject()
  @IsNotEmpty()
  name: Name;

  @IsEmail()
  email: string;

  @MinLength(6)
  @MaxLength(20)
  @IsNotEmpty()
  password: string;
}
