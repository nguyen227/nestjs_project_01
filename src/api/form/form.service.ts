import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailService } from 'src/services/mail/mail.service';
import { FindManyOptions } from 'typeorm';
import { PERMISSIONS } from '../permission/permission.enum';
import { UserService } from '../user/user.service';
import { GetFormReportDto, StatusDto, ViewFormDto } from './dto';
import { ApproveFormDto } from './dto/approve-form.dto';
import { CreateFormDto } from './dto/create-form.dto';
import { SubmitFormDto } from './dto/submit-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Form } from './form.entity';
import { FormStatus } from './form.enum';
import { FormRepository } from './form.repository';

@Injectable()
export class FormService {
  constructor(
    private formRepo: FormRepository,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private mailService: MailService,
  ) {}

  async getFormsByUserId(userId: number, statusDto: StatusDto): Promise<Form[]> {
    const { status } = statusDto;
    return this.formRepo.findByUserId(userId, status);
  }

  async getFormsByFormId(userId: number, viewFormDto: ViewFormDto): Promise<any> {
    const { id } = viewFormDto;
    const userPermissions = await this.userService.getPermissionsNameByUserId(userId);
    const formFound = await this.formRepo.findOne(
      { id },
      { owner: true, reviewer: true },
      { reviewer: { id: true, username: true }, owner: { id: true, username: true } },
    );
    if (!formFound) throw new NotFoundException();
    if (formFound.owner.id != userId && !userPermissions.includes(PERMISSIONS.READ_ALL_FORM))
      throw new ForbiddenException("You don't have permissions to view this form");
    return formFound;
  }

  async viewFormNeedApprove(userId: number): Promise<Form[]> {
    const formsFound = await this.formRepo.find(
      { status: FormStatus.SUBMITED, reviewer: { id: userId } },
      { reviewer: true, owner: true },
      { reviewer: {}, owner: { username: true } },
    );
    return formsFound;
  }

  async updateForm(authUserId: number, updateFormDto: UpdateFormDto): Promise<Form> {
    const { formId, form_data } = updateFormDto;
    const formFound = await this.formRepo.findOneById(formId);
    if (formFound.owner.id !== authUserId) throw new ForbiddenException();
    const formUpdate = Object.assign(formFound, form_data);
    return this.formRepo.save(formUpdate);
  }

  async createForm(createFormDto: CreateFormDto): Promise<any> {
    const { userIds } = createFormDto;
    for await (const ownerId of userIds) {
      const userFound = await this.userService.getUserById(ownerId);
      const formCreate = this.formRepo.create(createFormDto);
      formCreate.owner = userFound;
      await this.formRepo.save(formCreate);
      this.mailService.sendNewFormNotification(userFound, formCreate);
    }
    return { message: `create form successful for users: ${userIds}` };
  }

  async submitForm(userId: number, { formId }: SubmitFormDto): Promise<any> {
    const manager = await this.userService.getUserManager(userId);
    const formFound = await this.formRepo.findOne(
      { id: formId },
      { owner: true, reviewer: true },
      { owner: { id: true } },
    );
    if (formFound.owner.id !== userId) throw new ForbiddenException();
    if (formFound.status !== FormStatus.NEW)
      throw new BadRequestException(`This form has been submited`);

    formFound.reviewer = manager;
    formFound.status = FormStatus.SUBMITED;

    await this.formRepo.save(formFound);
    return { message: `submit form successful` };
  }

  async approveForm(authUserId: number, approveFormDto: ApproveFormDto): Promise<Form> {
    const { formId, review } = approveFormDto;

    const formFound = await this.formRepo.findOne(
      { id: formId },
      { reviewer: true },
      { reviewer: { id: true } },
    );

    if (formFound.reviewer.id !== authUserId)
      throw new ForbiddenException(`You can't approve this form`);

    if (formFound.status === FormStatus.CLOSED || formFound.status === FormStatus.APPROVED)
      throw new BadRequestException(`You already approved this form`);
    formFound.status = FormStatus.APPROVED;
    formFound.review = review;

    return this.formRepo.save(formFound);
  }

  async closeForm(formId: number): Promise<Form> {
    const formFound = await this.formRepo.findOneById(formId);

    if (!formFound) throw new BadRequestException(`Form not found!`);
    if (formFound.status === FormStatus.CLOSED)
      throw new BadRequestException(`Form already closed!`);
    formFound.status = FormStatus.CLOSED;

    return this.formRepo.save(formFound);
  }

  async getFormReport(query: GetFormReportDto) {
    const { status, type, reviewerId, ownerId } = query;
    const conditions: FindManyOptions = {
      loadRelationIds: true,
      where: {
        status,
        type,
        reviewer: {
          id: reviewerId,
        },
        owner: {
          id: ownerId,
        },
      },
    };
    const result = await this.formRepo.findByConditionsAndCount(conditions);
    return { data: result[0], count: result[1] };
  }
}
