let knex;
const setKnex = ( args={} ) => {
  let {host, user, password, database} = args;
  knex = require('knex')({
    client: 'mysql2',
    connection: {
      host: host || process.env['DATAWAREHOUSE_HOST'],
      port: '3306',
      user: user || process.env['DATAWAREHOUSE_USERNAME'],
      password: password || process.env['DATAWAREHOUSE_PASSWORD'],
      database: database || process.env['DATAWAREHOUSE_DATABASE'],
    },
  });
  return knex;
};

if (!knex)
  knex = setKnex();
const getKnex = () => knex;

module.exports={
  setKnex: setKnex,
  getKnex: getKnex,
};
