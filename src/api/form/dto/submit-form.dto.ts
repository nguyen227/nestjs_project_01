import { IsNumber } from 'class-validator';

export class SubmitFormDto {
  @IsNumber()
  formId: number;
}
