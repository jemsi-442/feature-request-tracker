import User from "./User.js";
import FeatureRequest from "./FeatureRequest.js";

User.hasMany(FeatureRequest, { foreignKey: "createdBy", as: "featureRequests" });
FeatureRequest.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
FeatureRequest.belongsTo(User, { foreignKey: "updatedBy", as: "updater" });

export { User, FeatureRequest };
