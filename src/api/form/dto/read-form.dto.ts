import { IsEnum, IsOptional } from 'class-validator';
import { FormStatus } from '../form.enum';

export class StatusDto {
  @IsEnum(FormStatus)
  @IsOptional()
  status?: FormStatus = FormStatus.NEW;
}
