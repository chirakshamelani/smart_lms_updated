export async function up(knex) {
  // Step 1: Add the created_by column as nullable
  await knex.schema.table('quizzes', table => {
    table.integer('created_by').unsigned().nullable();
  });

  // Step 2: Find a default user (e.g., an admin or any user)
  const defaultUser = await knex('users').select('id').where('role', 'admin').first();
  let defaultUserId = 1; // Fallback user ID

  if (!defaultUser) {
    // If no admin user is found, try to get any user or throw an error
    const anyUser = await knex('users').select('id').first();
    if (!anyUser) {
      throw new Error('No users found in the users table. Please insert at least one user before running this migration.');
    }
    defaultUserId = anyUser.id;
  } else {
    defaultUserId = defaultUser.id;
  }

  // Step 3: Update existing rows to set a valid created_by value
  await knex('quizzes').update({ created_by: defaultUserId });

  // Step 4: Alter the column to make it non-nullable
  await knex.schema.table('quizzes', table => {
    table.integer('created_by').unsigned().notNullable().alter();
  });

  // Step 5: Add the foreign key constraint
  await knex.schema.table('quizzes', table => {
    table.foreign('created_by').references('users.id').onDelete('RESTRICT');
  });
}

export async function down(knex) {
  return knex.schema.table('quizzes', table => {
    table.dropForeign(['created_by']);
    table.dropColumn('created_by');
  });
}