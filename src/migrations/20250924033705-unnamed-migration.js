'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add 'config' JSONB to custom_fields (for future type-specific settings, e.g., formula)
    await queryInterface.addColumn('custom_fields', 'config', {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    // Options table for dropdowns
    await queryInterface.createTable('custom_field_options', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), allowNull: false, primaryKey: true },
      custom_field_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'custom_fields', key: 'id' },
        onDelete: 'CASCADE',
      },
      label: { type: Sequelize.STRING, allowNull: false },
      value: { type: Sequelize.STRING, allowNull: false },
      sort_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.addIndex('custom_field_options', ['custom_field_id', 'sort_order']);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('custom_fields', 'config');
    await queryInterface.dropTable('custom_field_options');
  }
};
