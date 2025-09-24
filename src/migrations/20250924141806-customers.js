'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add customer_id to these tables
    const tables = ['opportunities', 'quotes', 'sales_orders', 'jobs'];
    for (const t of tables) {
      await queryInterface.addColumn(t, 'customer_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'customers', key: 'id' },
        onDelete: 'SET NULL',
      });
      await queryInterface.addIndex(t, ['customer_id']);
    }
  },

  async down(queryInterface) {
    const tables = ['opportunities', 'quotes', 'sales_orders', 'jobs'];
    for (const t of tables) {
      await queryInterface.removeIndex(t, ['customer_id']);
      await queryInterface.removeColumn(t, 'customer_id');
    }
  }
};
