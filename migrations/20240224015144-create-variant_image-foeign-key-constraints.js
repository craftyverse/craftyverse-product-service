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
    // await queryInterface.addConstraint(
    //   "variant_image",
    //   {
    //     fields: ["variantId"],
    //     type: "foreign key",
    //     name: "variant_image_variantId_fk",
    //     references: {
    //       table: "variant",
    //       field: "id",
    //     },
    //     onDelete: "cascade",
    //     onUpdate: "cascade",
    //   },
    //   { transaction }
    // );

    // await queryInterface.addConstraint(
    //   "variant_image",
    //   {
    //     fields: ["imageId"],
    //     type: "foreign key",
    //     name: "variant_image_imageId_fk",
    //     references: {
    //       table: "image",
    //       field: "id",
    //     },
    //     onDelete: "cascade",
    //     onUpdate: "cascade",
    //   },
    //   { transaction }
    // );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const transaction = await queryInterface.sequelize.transaction();
    await queryInterface.removeConstraint("variant_image", "variant_image_variantId_fk", { transaction });
    await queryInterface.removeConstraint("variant_image", "variant_image_imageId_fk", { transaction });
  },
};
