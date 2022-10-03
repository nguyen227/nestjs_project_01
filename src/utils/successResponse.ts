import { HttpStatus } from 'aws-sdk/clients/lambda';

export const genResponse = (statusCode: HttpStatus, data: any, message?: string) => ({
  success: true,
  statusCode,
  data,
  message: message ? message : 'Successful',
});
