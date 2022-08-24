export const mockJwtService = {
  sign: () => 'test_token',
  verify: () => ({ id: 1 }),
};
