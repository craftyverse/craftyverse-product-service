"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable("variant", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        productId: {
          allowNull: false,
          unique: false,
          type: Sequelize.INTEGER,
        },
        locationId: {
          allowNull: false,
          unique: false,
          type: Sequelize.STRING,
        },
        variantName: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        description: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        price: {
          allowNull: false,
          type: Sequelize.DECIMAL,
        },
        saleCount: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        inventory: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        currency: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        sku: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        inStock: {
          allowNull: false,
          type: Sequelize.BOOLEAN,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        deletedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      });
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable("variant");
  },
};
