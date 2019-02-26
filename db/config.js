require ('dotenv').config ();

const pool = {
  max: 5,
  min: 0,
  idle: 20000,
  acquire: 20000,
};
module.exports = {
  development: {
    username: process.env.MYSQL_DB_USERNAME || 'root',
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_NAME || 'communities',
    port: process.env.MYSQL_DB_PORT || 3306,
    host: process.env.MYSQL_DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: process.env.MYSQL_DB_LOGGING,
    pool,
    define: {
      charset: 'utf8mb4',
      dialectOptions: {
        collate: 'utf8mb4_general_ci',
      },
    },
  },
  production: {
    username: process.env.MYSQL_DB_USERNAME,
    port: process.env.MYSQL_DB_PORT,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    host: process.env.MYSQL_DB_HOST,
    dialect: 'mysql',
    logging: process.env.MYSQL_DB_LOGGING,
    pool,
    define: {
      charset: 'utf8mb4',
      dialectOptions: {
        collate: 'utf8mb4_general_ci',
      },
    },
  },
};
