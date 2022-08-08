import { Body, Controller, Get, Post, Put, Query, Request } from '@nestjs/common';
import { HasPermissions } from 'src/auth/decorators';
import { RolePermission } from '../permission/permission.enum';
import { ApproveFormDto, CreateFormDto, SubmitFormDto, UpdateFormDto } from './dto/form.dto';
import { FormService } from './form.service';

@Controller('form')
export class FormController {
  constructor(private formService: FormService) {}

  @Get()
  @HasPermissions(RolePermission.READ_FORM)
  public viewOwnForm(@Query('userId') userId: number) {
    return this.formService.getFormByUserId(userId);
  }

  @Get('/all')
  public viewForm(@Query() query: any) {
    return this.formService.getAllFormByConditions(query);
  }

  @Post()
  @HasPermissions(RolePermission.CREATE_FORM)
  public createForm(@Body() createFormDto: CreateFormDto) {
    return this.formService.createForm(createFormDto);
  }

  @Put()
  @HasPermissions(RolePermission.UPDATE_FORM)
  public updateForm(@Request() req: any, @Body() updateFormDto: UpdateFormDto) {
    return this.formService.updateForm(req.user.id, updateFormDto);
  }

  @Put('/submit')
  @HasPermissions(RolePermission.SUBMIT_FORM)
  public submitForm(@Request() req: any, @Body() submitFormDto: SubmitFormDto) {
    return this.formService.submitForm(req.user.userId, submitFormDto);
  }

  @Put('/approve')
  @HasPermissions(RolePermission.APPROVE_FORM)
  public approveForm(@Request() req: any, @Body('userId') approveFormDto: ApproveFormDto) {
    return this.formService.approveForm(req.user.userId, approveFormDto);
  }

  @Put('/close')
  @HasPermissions(RolePermission.CLOSE_FORM)
  public closeForm(@Query('formId') formId: number) {
    return this.formService.closeForm(formId);
  }
}
