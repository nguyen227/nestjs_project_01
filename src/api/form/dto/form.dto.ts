import { IsEnum, isNumber, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { FormData } from '../form.entity';
import { FormType } from '../form.enum';

export class UpdateFormDto {
  @IsObject()
  @IsOptional()
  form_data: FormData;

  @IsNumber()
  formId: number;
}

export class SubmitFormDto {
  @IsNumber()
  formId: number;
}

export class CreateFormDto {
  @IsEnum(FormType)
  type: FormType;

  @IsNumber()
  ownerId: number;
}

export class ApproveFormDto {
  @IsNumber()
  formId: number;

  @IsString()
  review: string;
}
