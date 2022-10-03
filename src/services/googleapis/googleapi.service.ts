import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { forms_v1, google } from 'googleapis';
import { join } from 'path';

const scopes = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/spreadsheets',
];
const credentialsPath = join(__dirname, './keys/credentials.json');
const drive_folder_id = '1KdGehGQ6FS9FdJjqaHU2Vxo-geLqCxfP';

@Injectable()
export class GoogleApiService {
  private auth = new google.auth.GoogleAuth({ keyFile: credentialsPath, scopes });

  async uploadFile() {
    const drive = google.drive({ version: 'v3', auth: this.auth });

    const createFile = await drive.files.create({
      requestBody: { name: 'test', parents: [drive_folder_id] },
      media: {
        body: createReadStream(credentialsPath),
      },
    });
    return createFile;
  }

  async createForm() {
    const forms = google.forms({ version: 'v1', auth: this.auth });
    const newForm: forms_v1.Schema$Form = {
      info: { title: 'New Form from NestJS_Project_01', documentTitle: 'NewForm' },
    };

    const formCreate = await forms.forms.create({ requestBody: newForm });

    return formCreate;
  }

  async createSpreadSheet(data: object[]) {
    const sheetService = google.sheets({ version: 'v4', auth: this.auth });
    const driveService = google.drive({ version: 'v3', auth: this.auth });

    const createdSheet = await sheetService.spreadsheets.create({
      requestBody: { properties: { title: 'Test SpreadSheet' } },
    });
    const fields = Object.keys(data[0]);
    const mappedValues = data.map((item) => Object.values(item));
    const values: string[][] = [fields, ...mappedValues];

    await sheetService.spreadsheets.values.update({
      spreadsheetId: createdSheet.data.spreadsheetId,
      range: 'A1',
      requestBody: { values },
      valueInputOption: 'USER_ENTERED',
    });
    await driveService.permissions.create({
      requestBody: { type: 'anyone', role: 'reader' },
      fileId: createdSheet.data.spreadsheetId,
      fields: 'id',
    });
    return createdSheet.data.spreadsheetUrl;
  }
}
