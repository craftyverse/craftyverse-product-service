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
      await queryInterface.createTable('location', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        locationId: {
          allowNull: false,
          type: Sequelize.STRING
        },
        locationLegalName: {
          allowNull: false,
          type: Sequelize.STRING
        },
        locationUserEmail: {
          allowNull: false,
          type: Sequelize.STRING
        },
        locationEmail: {
          allowNull: false,
          type: Sequelize.STRING
        },
        locationIndustry: {
          allowNull: false,
          type: Sequelize.STRING
        },
        locationRegion: {
          allowNull: false,
          type: Sequelize.STRING
        },
        locationCurrency: {
          allowNull: false,
          type: Sequelize.STRING
        },
        locationTimeZone: {
          allowNull: false,
          type: Sequelize.STRING
        },
        locationSiUnit: {
          allowNull: false,
          type: Sequelize.STRING
        },
        locationAddressLine1: {
          allowNull: false,
          type: Sequelize.STRING
        },
        locationAddressLine2: {
          allowNull: false,
          type: Sequelize.STRING
        },
        locationCity: {
          allowNull: false,
          type: Sequelize.STRING
        },
        locationState: {
          allowNull: false,
          type: Sequelize.STRING
        },
        locationCountry: {
          allowNull: false,
          type: Sequelize.STRING
        },
        locationPostCode: {
          allowNull: false,
          type: Sequelize.STRING
        },
        locationApproved: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        locationApprovedAt: {
          allowNull: true,
          type: Sequelize.STRING
        },
        locationCreatedAt: {
          allowNull: false,
          type: Sequelize.STRING
        },
        locationDeletedAt: {
          allowNull: true,
          type: Sequelize.STRING
        }
      });

      return transaction.commit();
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
    return queryInterface.dropTable("location");
  }
};
