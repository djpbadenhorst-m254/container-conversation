const knexExp = require('./knex.js');
const queriesExp = require('./queries.js');

module.exports={
  ...knexExp,
  ...queriesExp
};
