const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    event_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Event name cannot be empty" },
        len: { args: [3, 150], msg: "Event name must be between 3 and 150 chars" },
      },
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: { isUUID: 4 },
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    scheduled_date: { type: DataTypes.DATEONLY, allowNull: false },
    start_time: { type: DataTypes.TIME, allowNull: false },
    end_time: { type: DataTypes.TIME, allowNull: false },
    location: { type: DataTypes.JSON, allowNull: true },
    capacity: { type: DataTypes.INTEGER, allowNull: true },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    status: {
      type: DataTypes.ENUM("draft", "published", "cancelled", "completed", "rewarded"),
      allowNull: false,
      defaultValue: "draft",
    },
    points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    badge_id: { type: DataTypes.UUID, allowNull: false, validate: { isUUID: 4 } },
    media: { type: DataTypes.JSON, allowNull: true },
  },
  {
    tableName: "Events",
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ["organization_id", "event_name"] }, // ✅ composite unique
      { fields: ["status"] },
      { fields: ["scheduled_date"] },
    ],
  }
);

module.exports = Event
