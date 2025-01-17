import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileService {
  constructor(
    @Inject('FILE_REPO')
    private fileRepo: Repository<File>,
    private configService: ConfigService,
  ) {}

  async uploadFile(dataBuffer: Buffer, filename: string, mimetype: string) {
    const s3 = new S3();
    const config: any = this.configService.get('s3bucket');

    const uploadResult = await s3
      .upload({
        Bucket: config.bucket_name,
        Body: dataBuffer,
        Key: `${uuid()}`,
        ContentType: mimetype,
      })
      .promise();

    const newFile = this.fileRepo.create({ key: uploadResult.Key, url: uploadResult.Location });

    await this.fileRepo.save(newFile);
    return newFile;
  }

  async putFile(fileId: number, dataBuffer: Buffer, mimetype: string) {
    const file = await this.fileRepo.findOneBy({ id: fileId });
    const s3 = new S3();
    const config: any = this.configService.get('s3bucket');
    const uploadResult = await s3
      .putObject({
        Bucket: config.bucket_name,
        Key: file.key,
        Body: dataBuffer,
        ContentType: mimetype,
      })
      .promise();
    return file;
  }
}
