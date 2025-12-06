"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 🧹 Remove the old unique constraint on event_name
    await queryInterface.removeConstraint("Events", "Events_event_name_key").catch(() => {});

    // 🆕 Add new composite unique constraint (organization_id + event_name)
    await queryInterface.addConstraint("Events", {
      fields: ["organization_id", "event_name"],
      type: "unique",
      name: "unique_event_per_org",
    });
  },

  async down(queryInterface, Sequelize) {
    // 🔁 Revert back to unique on event_name only
    await queryInterface.removeConstraint("Events", "unique_event_per_org").catch(() => {});
    await queryInterface.addConstraint("Events", {
      fields: ["event_name"],
      type: "unique",
      name: "Events_event_name_key",
    });
  },
};
