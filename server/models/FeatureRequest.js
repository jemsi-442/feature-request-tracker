import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const FeatureRequest = sequelize.define(
  "FeatureRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(160),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      allowNull: false,
      defaultValue: "medium",
    },
    status: {
      type: DataTypes.ENUM("open", "in_progress", "completed"),
      allowNull: false,
      defaultValue: "open",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "created_by",
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      field: "updated_by",
    },
  },
  {
    tableName: "feature_requests",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default FeatureRequest;
