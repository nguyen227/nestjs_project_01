import { IsNumber, IsObject, IsOptional } from 'class-validator';
import { FormData } from '../form.entity';

export class UpdateFormDto {
  @IsObject()
  @IsOptional()
  form_data: FormData;

  @IsNumber()
  formId: number;
}
