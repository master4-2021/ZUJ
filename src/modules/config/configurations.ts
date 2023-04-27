export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  host: process.env.HOST,
  database: {
    mysql: {
      url: process.env.MYSQL_URL,
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT, 10),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      synchronize: process.env.MYSQL_SYCRONIZE,
      dropSchema: process.env.MYSQL_DROP_SCHEMA,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN, 10),
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN, 10),
  },
  encryptionAndHash: {
    encryptionSecret: process.env.ENCRYPTION_SECRET,
    hashSaltOrRound: parseInt(process.env.SALT_OR_ROUND, 10) || 10,
  },
});
