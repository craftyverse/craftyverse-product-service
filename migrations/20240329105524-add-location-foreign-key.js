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
    await queryInterface.addConstraint(
      "product",
      {
        fields: ["locationId"],
        type: "foreign key",
        name: "location_id_fk",
        references: {
          table: "location",
          field: "locationId",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      { transaction }
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const transaction = await queryInterface.sequelize.transaction();
    await queryInterface.removeConstraint("location", "location_id_fk", { transaction });
  }
};
