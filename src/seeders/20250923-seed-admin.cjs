const bcrypt = require('bcrypt');

module.exports = {
  async up(q) {
    const password_hash = await bcrypt.hash('admin123', 10);
    await q.bulkInsert('users', [{
      id: q.sequelize.literal('gen_random_uuid()'),
      email: 'admin@example.com',
      name: 'Admin',
      password_hash,
      created_at: new Date(),
      updated_at: new Date(),
    }]);
  },
  async down(q) {
    await q.bulkDelete('users', { email: 'admin@example.com' });
  },
};
