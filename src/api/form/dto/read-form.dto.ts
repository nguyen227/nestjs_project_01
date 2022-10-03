import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { FormStatus } from '../form.enum';

export class StatusDto {
  @IsEnum(FormStatus)
  @IsOptional()
  status?: FormStatus;
}

export class ViewFormDto {
  @IsNumber()
  @Type(() => Number)
  id: number;
}
