"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Convert to TIME (for only hour:minute:second)
    await queryInterface.changeColumn("Events", "start_time", {
      type: Sequelize.TIME,
      allowNull: false,
    });

    await queryInterface.changeColumn("Events", "end_time", {
      type: Sequelize.TIME,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert to full DATE type
    await queryInterface.changeColumn("Events", "start_time", {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.changeColumn("Events", "end_time", {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
