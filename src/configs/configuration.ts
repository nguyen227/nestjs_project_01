export default () => ({
  port: process.env.PORT || 3000,
  mysql_config: {
    host: process.env.MYSQL_HOST || 'mysql',
    port: process.env.MYSQL_PORT || 3306,
    username: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DB_NAME || 'nestjs_project_01',
  },
  bcrypt_salt: parseInt(process.env.BCRYPT_SALT_ROUND) || 10,
  jwt_config: {
    secret: process.env.JWT_SECRET || 'jwt_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '10m',
  },
  s3bucket: {
    region: process.env.AWS_REGION,
    access_key: process.env.AWS_ACCESS_KEY,
    secret_key: process.env.AWS_SECRET_ACCESS_KEY,
    bucket_name: process.env.AWS_PUBLIC_BUCKET_NAME,
  },
});
