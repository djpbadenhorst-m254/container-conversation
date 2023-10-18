exports.up = async function(knex) {
  await knex.schema.createTable('speaker_data', function(table) {
    table.uuid('id').defaultTo(knex.raw('(UUID())')).primary();
    table.uuid('speaker_id').references('id').inTable('speakers');
    table.json('speaker_data');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('speaker_data');
};
