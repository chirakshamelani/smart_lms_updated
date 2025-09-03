export async function up(knex) {
  await knex.schema.table('assignment_submissions', (table) => {
    table
      .enum('status', ['submitted', 'graded', 'late'])
      .defaultTo('submitted');
  });
}

export async function down(knex) {
  await knex.schema.table('assignment_submissions', (table) => {
    table.dropColumn('status');
  });
}
