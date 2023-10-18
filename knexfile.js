module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host:     process.env['DATAWAREHOUSE_HOST'],
      database: process.env['DATAWAREHOUSE_DATABASE'],
      user:     process.env['DATAWAREHOUSE_USERNAME'],
      password: process.env['DATAWAREHOUSE_PASSWORD']
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
