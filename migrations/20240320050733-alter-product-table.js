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
      await queryInterface.changeColumn('product', 'varientId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "variant",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
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
    try {
      await queryInterface.changeColumn('product', 'varientId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "variant",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
