// migrations/20231001120000-add-google-columns-to-users.js
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'google_id', {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  });
  await queryInterface.addColumn('users', 'google_access_token', {
    type: Sequelize.TEXT,
    allowNull: true,
  });
  await queryInterface.addColumn('users', 'google_refresh_token', {
    type: Sequelize.TEXT,
    allowNull: true,
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('users', 'google_refresh_token');
  await queryInterface.removeColumn('users', 'google_access_token');
  await queryInterface.removeColumn('users', 'google_id');
}
