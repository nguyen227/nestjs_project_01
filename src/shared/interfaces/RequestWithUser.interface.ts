import { Request } from 'express';
import { JwtPayload } from 'src/auth/interfaces';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
