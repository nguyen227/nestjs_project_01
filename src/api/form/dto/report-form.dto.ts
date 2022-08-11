import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsNumber } from 'class-validator';
import { FormType, FormStatus } from '../form.enum';

export class GetFormReportDto {
  @IsEnum(FormType)
  @IsOptional()
  type?: FormType;

  @IsEnum(FormStatus)
  @IsOptional()
  status?: FormStatus;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  reviewerId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  ownerId?: number;
}
