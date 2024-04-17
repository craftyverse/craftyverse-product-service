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
      await queryInterface.addConstraint(
        "product",
        {
          fields: ["locationId"],
          type: "foreign key",
          name: "product_locationId_fk",
          references: {
            table: "location",
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeConstraint("product", "product_locationId_fk"),
    ]);
  }
};
