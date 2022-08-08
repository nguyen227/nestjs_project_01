export interface LoginRes {
  userId: number;
  accessToken: string;
  accessTokenExpireIn?: number | string;
}
