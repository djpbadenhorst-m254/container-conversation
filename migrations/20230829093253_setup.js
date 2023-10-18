exports.up = async function(knex) {
  await knex.schema.createTable('speakers', function(table) {
    table.uuid('id').defaultTo(knex.raw('(UUID())')).primary();
    table.timestamp('ts_created').notNullable().defaultTo(knex.fn.now());
    table.string('whatsapp_user_id');
    table.string('facebook_user_id');
    table.string('lgp_lead_id');
    table.string('app_user_id');
    table.string('phone_number');
    table.string('email');
  });
  await knex.schema.createTable('conversations', function(table) {
    table.timestamp('ts_created').notNullable().defaultTo(knex.fn.now());
    table.uuid('id').defaultTo(knex.raw('(UUID())')).primary();
    table.uuid('speaker_id').references('id').inTable('speakers');
    table.string('status').defaultTo('active');
    table.timestamp('ts_last_interaction').notNullable().defaultTo(knex.fn.now());
    table.string('last_interaction_code');
  });
  await knex.schema.createTable('responses', function(table) {
    table.uuid('id').defaultTo(knex.raw('(UUID())')).primary();
    table.timestamp('ts').notNullable().defaultTo(knex.fn.now());
    table.uuid('speaker_id').references('id').inTable('speakers');
    table.uuid('conversation_id').references('id').inTable('conversations');
    table.string('channel');
    table.json('payload');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('responses');
  await knex.schema.dropTable('conversations');
  await knex.schema.dropTable('speakers');
};
