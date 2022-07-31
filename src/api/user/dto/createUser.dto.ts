import { IsEmail, IsObject, IsString, MaxLength, MinLength } from 'class-validator';
import { Name } from 'src/shared/entity/NameExtend';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsObject()
  name: Name;

  @IsEmail()
  email: string;

  @MinLength(6)
  @MaxLength(20)
  password: string;
}
