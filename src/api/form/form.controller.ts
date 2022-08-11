import { Body, Controller, Get, Post, Put, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HasPermissions } from 'src/auth/decorators';
import { RolePermission } from '../permission/permission.enum';
import { GetFormReportDto, StatusDto } from './dto';
import { ApproveFormDto } from './dto/approve-form.dto';
import { CreateFormDto } from './dto/create-form.dto';
import { SubmitFormDto } from './dto/submit-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { FormService } from './form.service';

@Controller('form')
@ApiTags('form')
@ApiBearerAuth()
export class FormController {
  constructor(private formService: FormService) {}

  @Get()
  @HasPermissions(RolePermission.READ_FORM)
  @ApiOperation({ summary: 'View own form' })
  public viewOwnForm(@Request() req: any, @Query() statusDto?: StatusDto) {
    return this.formService.getFormsByUserId(req.user.userId, statusDto);
  }

  @Post()
  @HasPermissions(RolePermission.CREATE_FORM)
  @ApiOperation({ summary: 'Create form for user' })
  public createForm(@Body() createFormDto: CreateFormDto) {
    return this.formService.createForm(createFormDto);
  }

  @Put()
  @HasPermissions(RolePermission.UPDATE_FORM)
  @ApiOperation({ summary: 'Update own form data' })
  public updateForm(@Request() req: any, @Body() updateFormDto: UpdateFormDto) {
    return this.formService.updateForm(req.user.userId, updateFormDto);
  }

  @Put('/submit')
  @HasPermissions(RolePermission.SUBMIT_FORM)
  @ApiOperation({ summary: 'Submit form to manager' })
  public submitForm(@Request() req: any, @Body() submitFormDto: SubmitFormDto) {
    return this.formService.submitForm(req.user.userId, submitFormDto);
  }

  @Put('/approve')
  @HasPermissions(RolePermission.APPROVE_FORM)
  @ApiOperation({ summary: "Approve user's form" })
  public approveForm(@Request() req: any, @Body() approveFormDto: ApproveFormDto) {
    return this.formService.approveForm(req.user.userId, approveFormDto);
  }

  @Put('/close')
  @HasPermissions(RolePermission.CLOSE_FORM)
  @ApiOperation({ summary: "Close user's form" })
  public closeForm(@Query('formId') formId: number) {
    return this.formService.closeForm(formId);
  }

  @Get('/report')
  @HasPermissions(RolePermission.READ_ALL_FORM)
  @ApiOperation({ summary: 'View report about form' })
  public getFormReport(@Query() query: GetFormReportDto) {
    return this.formService.getFormReport(query);
  }
}
