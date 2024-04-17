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
      await queryInterface.removeColumn('product', 'createdAt');
      await queryInterface.addColumn('product', 'createdAt', {
        type: Sequelize.STRING,
        allowNull: false,
      });
      
      await queryInterface.removeColumn('product', 'updatedAt');
      await queryInterface.addColumn('product', 'updatedAt', {
        type: Sequelize.STRING,
        allowNull: true,
      });

      await queryInterface.removeColumn('product', 'deletedAt');
      await queryInterface.addColumn('product', 'deletedAt', {
        type: Sequelize.STRING,
        allowNull: true,
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
      await queryInterface.removeColumn('product', 'createdAt');
      await queryInterface.removeColumn('product', 'updatedAt');
      await queryInterface.removeColumn('product', 'deletedAt');

      await queryInterface.addColumn('product', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: false,
      });
      await queryInterface.addColumn('product', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: true,
      });
      await queryInterface.addColumn('product', 'deletedAt', {
        type: Sequelize.DATE,
        allowNull: true,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } 
};
