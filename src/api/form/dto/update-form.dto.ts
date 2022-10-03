import { IsNumber, IsString } from 'class-validator';

export class UpdateFormDto {
  @IsString()
  content: string;

  @IsNumber()
  formId: number;
}
