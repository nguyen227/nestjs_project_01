import { IsEnum, IsNumber } from 'class-validator';
import { FormType } from '../form.enum';

export class CreateFormDto {
  @IsEnum(FormType)
  type: FormType;

  @IsNumber({}, { each: true })
  userIds: number[];
}
