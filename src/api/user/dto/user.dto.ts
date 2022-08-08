import {
  IsEmail,
  IsEnum,
  IsIdentityCard,
  IsNumberString,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/api/role/role.entity';
import { UserRole } from 'src/api/role/role.enum';
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

  @IsString()
  @IsOptional()
  avatar?: string;
}

export class UpdateUserRoleDto {
  @IsEnum(UserRole, { each: true })
  roles: Role[];
}

export class UpdateProfileDto {
  @IsObject({ message: "provide name like 'name': {first: string, last: string}" })
  @IsOptional()
  name?: Name;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

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
