
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/simple-ledger',
    dbName: process.env.MONGODB_DB_NAME || 'simple-ledger',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    format: process.env.LOG_FORMAT || 'json',
  },
  
  swagger: {
    title: process.env.SWAGGER_TITLE || 'Simple Ledger API',
    description: process.env.SWAGGER_DESCRIPTION || 'A simplified double-entry ledger API with hash chaining',
    version: process.env.SWAGGER_VERSION || '1.0.0',
  },
});