exports.up = async function(knex) {
  await knex.schema.createTable('speakers', function(table) {
    table.uuid('id').defaultTo(knex.raw('(UUID())')).primary();
    table.specificType('ts_created', 'DATETIME(6)').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP(6)'));
    table.string('whatsapp_user_id');
    table.string('facebook_user_id');
    table.string('lgp_lead_id');
    table.string('app_user_id');
    table.string('web_user_id');
    table.string('phone_number');
    table.string('email');
  });
  await knex.schema.createTable('conversations', function(table) {
    table.specificType('ts_created', 'DATETIME(6)').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP(6)'));
    table.uuid('id').defaultTo(knex.raw('(UUID())')).primary();
    table.uuid('speaker_id').references('id').inTable('speakers');
    table.string('status').defaultTo('active');

    table.specificType('latest_incoming_ts', 'DATETIME(6)');
    table.specificType('latest_outgoing_ts', 'DATETIME(6)');
    table.string('latest_outgoing_code');
  });
  await knex.schema.createTable('incoming', function(table) {
    table.uuid('id').defaultTo(knex.raw('(UUID())')).primary();
    table.specificType('ts', 'DATETIME(6)').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP(6)'));
    table.uuid('conversation_id').references('id').inTable('conversations');
    table.string('channel');
    table.string('channel_id');
    table.string('status');
    
    table.json('payload');
    table.string('conversation_code');
  });
  await knex.schema.createTable('outgoing', function(table) {
    table.uuid('id').defaultTo(knex.raw('(UUID())')).primary();
    table.specificType('ts', 'DATETIME(6)').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP(6)'));
    table.uuid('conversation_id').references('id').inTable('conversations');
    table.string('channel');
    table.string('channel_id');
    table.string('status');
    
    table.json('payload');
    table.string('conversation_code');
  });
  await knex.schema.createTable('speaker_data', function(table) {
    table.uuid('id').defaultTo(knex.raw('(UUID())')).primary();
    table.uuid('speaker_id').references('id').inTable('speakers');
    table.json('speaker_data');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('speaker_data');
  await knex.schema.dropTable('incoming');
  await knex.schema.dropTable('outgoing');
  await knex.schema.dropTable('conversations');
  await knex.schema.dropTable('speakers');
};
