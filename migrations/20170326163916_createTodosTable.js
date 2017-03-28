function up(knex) {
return knex.schema.createTable('todos', (t) => {
    t.uuid('id').primary();
    t.uuid('user_id').index();
    t.text('title').unique();
    t.text('tag');
    t.timestamps();
  });
}

function down(knex) {
return knex.schema.dropTable('todos');
}

module.exports = {up, down};
