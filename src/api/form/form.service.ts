import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { UserService } from '../user/user.service';
import { ApproveFormDto, CreateFormDto, SubmitFormDto, UpdateFormDto } from './dto/form.dto';
import { Form } from './form.entity';
import { FormStatus } from './form.enum';
import { FormRepository } from './form.repository';

@Injectable()
export class FormService {
  constructor(private formRepo: FormRepository, private userService: UserService) {}

  async getAllFormByConditions(query: any): Promise<Form[]> {
    const { status, reviewerId } = query;
    const conditions: FindManyOptions = {
      where: {
        status,
        reviewer: {
          id: reviewerId,
        },
      },
      loadEagerRelations: true,
    };
    return this.formRepo.findBy(conditions);
  }

  async getFormByUserId(userId: number): Promise<Form> {
    return this.formRepo.findOneBy({ userId });
  }

  async updateForm(authUserId: number, updateFormDto: UpdateFormDto): Promise<Form> {
    const { formId, form_data } = updateFormDto;
    const formFound = await this.formRepo.findOneBy({ id: formId });
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
    const formFound = await this.formRepo.findOneBy({ id: formId });
    if (formFound.owner.id !== userId) throw new ForbiddenException();

    formFound.status = FormStatus.SUBMITED;

    return formFound;
    return formFound.save();
  }

  async approveForm(authUserId: number, approveFormDto: ApproveFormDto): Promise<Form> {
    const { formId, review } = approveFormDto;

    const formFound = await this.formRepo.findOneBy({ id: formId });
    const managerFound = await this.userService.findOneById(formFound.owner.id);
    if (managerFound.id !== authUserId) throw new ForbiddenException(`You can't approve this form`);

    formFound.status = FormStatus.APPROVED;
    formFound.review = review;

    return formFound.save();
  }

  async closeForm(formId: number): Promise<Form> {
    const formFound = await this.formRepo.findOneBy({ id: formId });

    if (!formFound) throw new BadRequestException(`Form not found!`);

    formFound.status = FormStatus.CLOSED;

    return formFound.save();
  }
}
