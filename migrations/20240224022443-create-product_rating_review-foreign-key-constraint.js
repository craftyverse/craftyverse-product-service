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
        "product_rating_review",
        {
          fields: ["productId"],
          type: "foreign key",
          name: "product_rating_review_productId_fk",
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
        "product_rating_review",
        {
          fields: ["ratingReviewId"],
          type: "foreign key",
          name: "product_rating_review_ratingReviewId_fk",
          references: {
            table: "rating_review",
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
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint("product_rating_review", "product_rating_review_productId_fk", {
        transaction,
      });
      await queryInterface.removeConstraint("product_rating_review", "product_rating_review_ratingReviewId_fk", {
        transaction,
      });
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
