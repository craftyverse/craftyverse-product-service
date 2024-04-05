'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn('location', 'locationId');
      await queryInterface.addColumn('location', 'locationId', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('location', 'locationId', {
        type: Sequelize.STRING,
        allowNull: false,
      });

      await transaction.commit();
    } catch {
      await transaction.rollback();
      throw error;
    }
  }
};
