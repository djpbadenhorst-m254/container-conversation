exports.up = async function(knex) {
  await knex.schema.table('responses', table => {
    table.string('conversation_code');
  })
};

exports.down = async function(knex) {
  await knex.schema.table('responses', table => {
    table.dropColumn('conversation_code');
  })
};
