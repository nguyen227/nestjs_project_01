import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { FindManyOptions } from 'typeorm';
import { RolePermission } from '../permission/permission.enum';
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
    const formFound = await this.formRepo.findOneByIdWithRelations(id, ['owner', 'reviewer']);
    if (!formFound) throw new NotFoundException();
    if (formFound.owner.id != userId && !userPermissions.includes(RolePermission.READ_ALL_FORM))
      throw new ForbiddenException("You don't have permissions to view this form");
    return formFound;
  }

  async updateForm(authUserId: number, updateFormDto: UpdateFormDto): Promise<Form> {
    const { formId, form_data } = updateFormDto;
    const formFound = await this.formRepo.findOneById(formId);
    if (formFound.owner.id !== authUserId) throw new ForbiddenException();
    const formUpdate = Object.assign(formFound, form_data);
    return formUpdate.save();
  }

  async createForm(createFormDto: CreateFormDto): Promise<any> {
    const { ownerIds } = createFormDto;
    for await (const ownerId of ownerIds) {
      const userFound = await this.userService.findOneById(ownerId);
      const manager = await this.userService.getUserManager(userFound.id);
      const formCreate = this.formRepo.create(createFormDto);
      formCreate.owner = userFound;
      formCreate.reviewer = manager;
      await formCreate.save();
      this.mailService.sendNewFormNotification(userFound, formCreate);
    }
    return { message: `create form successfully for users: ${ownerIds}` };
  }

  async submitForm(userId: number, { formId }: SubmitFormDto): Promise<Form> {
    const userFound = await this.userService.findOneById(userId);
    console.log(userFound.manager);
    const formFound = await this.formRepo.findOneById(formId);
    if (formFound.owner.id !== userId) throw new ForbiddenException();

    formFound.status = FormStatus.SUBMITED;

    return formFound;
    return formFound.save();
  }

  async approveForm(authUserId: number, approveFormDto: ApproveFormDto): Promise<Form> {
    const { formId, review } = approveFormDto;

    const formFound = await this.formRepo.findOneByIdWithRelations(formId, ['reviewer']);

    if (formFound.reviewer.id !== authUserId)
      throw new ForbiddenException(`You can't approve this form`);
    formFound.status = FormStatus.APPROVED;
    formFound.review = review;

    return formFound.save();
  }

  async closeForm(formId: number): Promise<Form> {
    const formFound = await this.formRepo.findOneById(formId);

    if (!formFound) throw new BadRequestException(`Form not found!`);

    formFound.status = FormStatus.CLOSED;

    return formFound.save();
  }

  async getFormReport(query: GetFormReportDto): Promise<[Form[], number]> {
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
    return this.formRepo.findByConditionsAndCount(conditions);
  }
}
