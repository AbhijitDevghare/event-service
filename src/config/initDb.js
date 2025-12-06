const sequelize = require('./db'); // your sequelize instance

const Event = require("../models/Event")

async function initDB(syncModels = false) {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Database");

    // Ensure associations are loaded
    Event;
    if (syncModels) {
      await sequelize.sync({ alter: true });
      console.log("✅ Database models synced");
    }
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    throw err;
  }
}

module.exports = { sequelize, initDB };
