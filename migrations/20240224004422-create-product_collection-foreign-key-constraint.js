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
        "product_collection",
        {
          fields: ["productId"],
          type: "foreign key",
          name: "product_collection_productId_fk",
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
        "product_collection",
        {
          fields: ["collectionId"],
          type: "foreign key",
          name: "product_collection_collectionId_fk",
          references: {
            table: "collection",
            field: "id",
          },
          onDelete: "cascade",
          onUpdate: "cascade",
        },
        { transaction }
      );

      return transaction.commit();
    } catch (error) {}
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    return Promise.all([
      queryInterface.removeConstraint("product_collection", "product_collection_productId_fk"),
      queryInterface.removeConstraint("product_collection", "product_collection_collectionId_fk"),
    ]);
  },
};
