'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Modify ENUM to include "completed"
    await queryInterface.changeColumn('Events', 'status', {
      type: Sequelize.ENUM('draft', 'published', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'draft',
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert ENUM to original
    await queryInterface.changeColumn('Events', 'status', {
      type: Sequelize.ENUM('draft', 'published', 'cancelled'),
      allowNull: false,
      defaultValue: 'draft',
    });
  }
};
