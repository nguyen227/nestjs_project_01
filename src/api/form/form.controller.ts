import { Body, Controller, Get, Post, Put, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HasPermissions } from 'src/shared/decorators';
import { PERMISSIONS } from '../permission/permission.enum';
import { GetFormReportDto, StatusDto, ViewFormDto } from './dto';
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
  @HasPermissions(PERMISSIONS.READ_FORM)
  @ApiOperation({ summary: 'View own form' })
  public viewOwnForm(@Request() req: any, @Query() statusDto?: StatusDto) {
    return this.formService.getFormsByUserId(req.user.id, statusDto);
  }

  @Get('/view')
  @HasPermissions(PERMISSIONS.READ_FORM)
  @ApiOperation({ summary: 'View own form by id' })
  public viewOwnFormById(@Request() req: any, @Query() viewFormDto?: ViewFormDto) {
    return this.formService.getFormsByFormId(req.user.id, viewFormDto);
  }

  @Post()
  @HasPermissions(PERMISSIONS.CREATE_FORM)
  @ApiOperation({ summary: 'Create form for user' })
  public createForm(@Body() createFormDto: CreateFormDto) {
    return this.formService.createForm(createFormDto);
  }

  @Put()
  @HasPermissions(PERMISSIONS.UPDATE_FORM)
  @ApiOperation({ summary: 'Update own form data' })
  public updateForm(@Request() req: any, @Body() updateFormDto: UpdateFormDto) {
    return this.formService.updateForm(req.user.id, updateFormDto);
  }

  @Put('/submit')
  @HasPermissions(PERMISSIONS.SUBMIT_FORM)
  @ApiOperation({ summary: 'Submit form to manager' })
  public submitForm(@Request() req: any, @Body() submitFormDto: SubmitFormDto) {
    return this.formService.submitForm(req.user.id, submitFormDto);
  }

  @Get('/approve')
  @HasPermissions(PERMISSIONS.APPROVE_FORM)
  @ApiOperation({ summary: 'View form need to approve' })
  public viewFormNeedApprove(@Request() req: any) {
    return this.formService.viewFormNeedApprove(req.user.id);
  }

  @Put('/approve')
  @HasPermissions(PERMISSIONS.APPROVE_FORM)
  @ApiOperation({ summary: "Approve user's form" })
  public approveForm(@Request() req: any, @Body() approveFormDto: ApproveFormDto) {
    return this.formService.approveForm(req.user.id, approveFormDto);
  }

  @Put('/close')
  @HasPermissions(PERMISSIONS.CLOSE_FORM)
  @ApiOperation({ summary: "Close user's form" })
  public closeForm(@Query('formId') formId: number) {
    return this.formService.closeForm(formId);
  }

  @Get('/report')
  @HasPermissions(PERMISSIONS.READ_ALL_FORM)
  @ApiOperation({ summary: 'View report about form' })
  public getFormReport(@Query() query: GetFormReportDto) {
    return this.formService.getFormReport(query);
  }
}
