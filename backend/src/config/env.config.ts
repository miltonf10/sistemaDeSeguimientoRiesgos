export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  jwt: {
    secret: process.env.JWT_SECRET ?? 'jwt_secret_riesgo_2026',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'jwt_refresh_secret_riesgo_2026',
    expiration: process.env.JWT_EXPIRATION ?? '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION ?? '7d',
  },
  database: {
    url: process.env.DATABASE_URL ?? '',
  },
});
