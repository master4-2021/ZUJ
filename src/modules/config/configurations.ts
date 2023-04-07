export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  host: process.env.HOST,
  database: {
    postgres: {
      url: process.env.PG_URL,
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT, 10),
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      synchronize: process.env.PG_SYCRONIZE,
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
