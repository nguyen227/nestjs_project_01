import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { UserService } from '../user/user.service';
import { GetFormReportDto, StatusDto } from './dto';
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
  ) {}

  async getFormsByUserId(userId: number, statusDto: StatusDto): Promise<Form[]> {
    const { status } = statusDto;
    return this.formRepo.findByUserId(userId, status);
  }

  async updateForm(authUserId: number, updateFormDto: UpdateFormDto): Promise<Form> {
    const { formId, form_data } = updateFormDto;
    const formFound = await this.formRepo.findOneById(formId);
    if (formFound.owner.id !== authUserId) throw new ForbiddenException();
    const formUpdate = Object.assign(formFound, form_data);
    return formUpdate.save();
  }

  async createForm(createFormDto: CreateFormDto): Promise<Form> {
    const { ownerId } = createFormDto;
    const userFound = await this.userService.findOneById(ownerId);
    const manager = await this.userService.getUserManager(userFound.id);
    const formCreate = this.formRepo.create(createFormDto);
    formCreate.owner = userFound;
    formCreate.reviewer = manager;
    return formCreate.save();
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
