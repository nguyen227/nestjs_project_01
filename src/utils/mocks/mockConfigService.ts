export const mockConfigService = {
  get(key: string) {
    switch (key) {
      case 'jwt_config':
        return {
          secret: 'secret_key_test',
          expiresIn: '10h',
        };
    }
  },
};
