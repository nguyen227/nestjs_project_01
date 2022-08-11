import { IsNumber, IsString } from 'class-validator';

export class ApproveFormDto {
  @IsNumber()
  formId: number;

  @IsString()
  review: string;
}
