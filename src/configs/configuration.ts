export default () => ({
  port: process.env.PORT || 3000,
  mysql_config: {
    host: process.env.MYSQL_HOST || 'mysql',
    port: process.env.MYSQL_PORT || 3306,
    username: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DB_NAME || 'nestjs_project_01',
  },
  bcrypt_salt: process.env.BCRYPT_SALT || 10,
  jwt_config: {
    secret: process.env.JWT_SECRET || 'jwt_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '10m',
  },
});
