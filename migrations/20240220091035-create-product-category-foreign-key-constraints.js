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
      await queryInterface.addConstraint(
        "product_category",
        {
          fields: ["productId"],
          type: "foreign key",
          name: "product_category_productId_fk",
          references: {
            table: "product",
            field: "id",
          },
          onDelete: "cascade",
          onUpdate: "cascade",
        },
        { transaction }
      );

      await queryInterface.addConstraint(
        "product_category",
        {
          fields: ["categoryId"],
          type: "foreign key",
          name: "product_category_categoryId_fk",
          references: {
            table: "category",
            field: "id",
          },
          onDelete: "cascade",
          onUpdate: "cascade",
        },
        { transaction }
      );

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
    return Promise.all([
      queryInterface.removeConstraint("product_category", "product_category_productId_fk"),
      queryInterface.removeConstraint("product_category", "product_category_categoryId_fk"),
    ]);
  },
};
