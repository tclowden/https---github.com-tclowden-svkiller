'use strict';

/** @type { import('sequelize-cli').Migration } */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query("CREATE EXTENSION IF NOT EXISTS pgcrypto");
    await queryInterface.createTable('users', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), allowNull: false, primaryKey: true },
        email: { type: Sequelize.STRING, allowNull: true },
        name: { type: Sequelize.STRING, allowNull: true },
        password_hash: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
      });

    await queryInterface.createTable('contacts', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), allowNull: false, primaryKey: true },
        first_name: { type: Sequelize.STRING, allowNull: true },
        last_name: { type: Sequelize.STRING, allowNull: true },
        phone_number: { type: Sequelize.STRING, allowNull: true },
        status: { type: Sequelize.STRING, allowNull: true },
        is_active: { type: Sequelize.STRING, allowNull: true },
        street_address: { type: Sequelize.STRING, allowNull: true },
        city: { type: Sequelize.STRING, allowNull: true },
        state: { type: Sequelize.STRING, allowNull: true },
        zip: { type: Sequelize.STRING, allowNull: true },
        email: { type: Sequelize.STRING, allowNull: true },
        roles: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
      });

    await queryInterface.createTable('roles', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), allowNull: false, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
      });

    await queryInterface.createTable('departments', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), allowNull: false, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
      });

    await queryInterface.createTable('opportunities', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), allowNull: false, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: true },
        customer: { type: Sequelize.STRING, allowNull: true },
        owner: { type: Sequelize.STRING, allowNull: true },
        sales_rep: { type: Sequelize.STRING, allowNull: true },
        associated_custom_field_ids: { type: Sequelize.STRING, allowNull: true },
        transaction_type: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
      });

    await queryInterface.createTable('sales_orders', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), allowNull: false, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: true },
        opportunity: { type: Sequelize.STRING, allowNull: true },
        customer: { type: Sequelize.STRING, allowNull: true },
        project_manager: { type: Sequelize.STRING, allowNull: true },
        sales_rep: { type: Sequelize.STRING, allowNull: true },
        associated_custom_field_ids: { type: Sequelize.STRING, allowNull: true },
        transaction_type: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
      });

    await queryInterface.createTable('quotes', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), allowNull: false, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: true },
        opportunity: { type: Sequelize.STRING, allowNull: true },
        customer: { type: Sequelize.STRING, allowNull: true },
        sales_order: { type: Sequelize.STRING, allowNull: true },
        project_manager: { type: Sequelize.STRING, allowNull: true },
        sales_rep: { type: Sequelize.STRING, allowNull: true },
        associated_custom_field_ids: { type: Sequelize.STRING, allowNull: true },
        transaction_type: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
      });

    await queryInterface.createTable('jobs', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), allowNull: false, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: true },
        opportunity: { type: Sequelize.STRING, allowNull: true },
        customer: { type: Sequelize.STRING, allowNull: true },
        sales_order: { type: Sequelize.STRING, allowNull: true },
        project_manager: { type: Sequelize.STRING, allowNull: true },
        associated_custom_field_ids: { type: Sequelize.STRING, allowNull: true },
        transaction_type: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
      });

    await queryInterface.createTable('customers', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), allowNull: false, primaryKey: true },
        company_name: { type: Sequelize.STRING, allowNull: true },
        street_address: { type: Sequelize.STRING, allowNull: true },
        city: { type: Sequelize.STRING, allowNull: true },
        state: { type: Sequelize.STRING, allowNull: true },
        zip: { type: Sequelize.STRING, allowNull: true },
        primary_contact: { type: Sequelize.STRING, allowNull: true },
        primary_phone_number: { type: Sequelize.STRING, allowNull: true },
        primary_email: { type: Sequelize.STRING, allowNull: true },
        billing_contact: { type: Sequelize.STRING, allowNull: true },
        billing_phone_number: { type: Sequelize.STRING, allowNull: true },
        billing_email: { type: Sequelize.STRING, allowNull: true },
        associated_custom_field_ids: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
      });

    await queryInterface.createTable('vendors', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), allowNull: false, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: true },
        street_address: { type: Sequelize.STRING, allowNull: true },
        city: { type: Sequelize.STRING, allowNull: true },
        state: { type: Sequelize.STRING, allowNull: true },
        zip: { type: Sequelize.STRING, allowNull: true },
        payment_terms: { type: Sequelize.STRING, allowNull: true },
        primary_contact: { type: Sequelize.STRING, allowNull: true },
        primary_phone_number: { type: Sequelize.STRING, allowNull: true },
        primary_email: { type: Sequelize.STRING, allowNull: true },
        billing_contact: { type: Sequelize.STRING, allowNull: true },
        billing_phone_number: { type: Sequelize.STRING, allowNull: true },
        billing_email: { type: Sequelize.STRING, allowNull: true },
        associated_custom_field_ids: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
      });

    await queryInterface.createTable('tasks', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), allowNull: false, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: true },
        owner: { type: Sequelize.STRING, allowNull: true },
        associated_custom_field_ids: { type: Sequelize.STRING, allowNull: true },
        transaction_type: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
      });

    await queryInterface.createTable('custom_fields', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), allowNull: false, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: true },
        type: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
      });

    await queryInterface.createTable('transaction_type', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), allowNull: false, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
      });

    await queryInterface.createTable('responses', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), allowNull: false, primaryKey: true },
        associated_transaction_id: { type: Sequelize.STRING, allowNull: true },
        associated_transaction_type: { type: Sequelize.STRING, allowNull: true },
        associated_field_name: { type: Sequelize.STRING, allowNull: true },
        value: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
      });

    await queryInterface.createTable('purchase_orders', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), allowNull: false, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: true },
        transaction_type: { type: Sequelize.STRING, allowNull: true },
        associated_custom_field_ids: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
      });

    await queryInterface.createTable('products', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), allowNull: false, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: true },
        unit_of_measure: { type: Sequelize.STRING, allowNull: true },
        cost_per_uom: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
      });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
    await queryInterface.dropTable('purchase_orders');
    await queryInterface.dropTable('responses');
    await queryInterface.dropTable('transaction_type');
    await queryInterface.dropTable('custom_fields');
    await queryInterface.dropTable('tasks');
    await queryInterface.dropTable('vendors');
    await queryInterface.dropTable('customers');
    await queryInterface.dropTable('jobs');
    await queryInterface.dropTable('quotes');
    await queryInterface.dropTable('sales_orders');
    await queryInterface.dropTable('opportunities');
    await queryInterface.dropTable('departments');
    await queryInterface.dropTable('roles');
    await queryInterface.dropTable('contacts');
    await queryInterface.dropTable('users');
  }
};
