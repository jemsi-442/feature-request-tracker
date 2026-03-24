import { Op } from "sequelize";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { FeatureRequest, User } from "../models/index.js";
import { sendResponse } from "../utils/apiResponse.js";
import { serializeFeatureRequest } from "../utils/serializers.js";

const PRIORITIES = ["low", "medium", "high"];
const STATUSES = ["open", "in_progress", "completed"];

const normalizeText = (value = "") => String(value).trim();
const normalizePriority = (value = "") => String(value).trim().toLowerCase();
const normalizeStatus = (value = "") => String(value).trim().toLowerCase();

const validateFeaturePayload = (payload, { partial = false, canUpdateStatus = false } = {}) => {
  const errors = [];
  const normalized = {};

  if (!partial || payload.title !== undefined) {
    const title = normalizeText(payload.title);
    if (title.length < 3) {
      errors.push({ field: "title", message: "Title must be at least 3 characters" });
    } else if (title.length > 160) {
      errors.push({ field: "title", message: "Title must not exceed 160 characters" });
    } else {
      normalized.title = title;
    }
  }

  if (!partial || payload.description !== undefined) {
    const description = normalizeText(payload.description);
    if (description.length < 10) {
      errors.push({ field: "description", message: "Description must be at least 10 characters" });
    } else {
      normalized.description = description;
    }
  }

  if (!partial || payload.priority !== undefined) {
    const priority = normalizePriority(payload.priority || "medium");
    if (!PRIORITIES.includes(priority)) {
      errors.push({ field: "priority", message: "Priority must be Low, Medium, or High" });
    } else {
      normalized.priority = priority;
    }
  }

  if (payload.status !== undefined) {
    if (!canUpdateStatus) {
      errors.push({ field: "status", message: "You are not allowed to update status" });
    } else {
      const status = normalizeStatus(payload.status);
      if (!STATUSES.includes(status)) {
        errors.push({ field: "status", message: "Status must be Open, In Progress, or Completed" });
      } else {
        normalized.status = status;
      }
    }
  }

  if (errors.length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  return normalized;
};

const featureIncludes = [
  { model: User, as: "creator", attributes: ["id", "name", "email", "role"] },
  { model: User, as: "updater", attributes: ["id", "name", "email", "role"] },
];

export const createFeatureRequest = asyncHandler(async (req, res) => {
  const payload = validateFeaturePayload(req.body, { canUpdateStatus: req.user?.role === "admin" });

  const featureRequest = await FeatureRequest.create({
    ...payload,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });

  const created = await FeatureRequest.findByPk(featureRequest.id, { include: featureIncludes });
  return sendResponse(res, 201, "Feature request created", serializeFeatureRequest(created));
});

export const getFeatureRequests = asyncHandler(async (req, res) => {
  const where = {};
  const status = normalizeStatus(req.query.status || "");
  const priority = normalizePriority(req.query.priority || "");
  const search = normalizeText(req.query.search || "");

  if (STATUSES.includes(status)) {
    where.status = status;
  }

  if (PRIORITIES.includes(priority)) {
    where.priority = priority;
  }

  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }

  const items = await FeatureRequest.findAll({
    where,
    include: featureIncludes,
    order: [["created_at", "DESC"]],
  });

  return sendResponse(res, 200, "Feature requests fetched", {
    items: items.map((item) => serializeFeatureRequest(item)),
  });
});

export const getFeatureRequestById = asyncHandler(async (req, res) => {
  const featureRequest = await FeatureRequest.findByPk(req.params.id, {
    include: featureIncludes,
  });

  if (!featureRequest) {
    throw new ApiError(404, "Feature request not found");
  }

  return sendResponse(res, 200, "Feature request fetched", serializeFeatureRequest(featureRequest));
});

export const updateFeatureRequest = asyncHandler(async (req, res) => {
  const featureRequest = await FeatureRequest.findByPk(req.params.id, {
    include: featureIncludes,
  });

  if (!featureRequest) {
    throw new ApiError(404, "Feature request not found");
  }

  const isAdmin = req.user?.role === "admin";
  const isOwner = String(featureRequest.createdBy) === String(req.user?._id);

  if (!isAdmin && !isOwner) {
    throw new ApiError(403, "You are not allowed to update this feature request");
  }

  const payload = validateFeaturePayload(req.body, {
    partial: true,
    canUpdateStatus: isAdmin || isOwner,
  });

  Object.assign(featureRequest, payload, { updatedBy: req.user._id });
  await featureRequest.save();

  const updated = await FeatureRequest.findByPk(featureRequest.id, { include: featureIncludes });
  return sendResponse(res, 200, "Feature request updated", serializeFeatureRequest(updated));
});

export const deleteFeatureRequest = asyncHandler(async (req, res) => {
  const featureRequest = await FeatureRequest.findByPk(req.params.id);

  if (!featureRequest) {
    throw new ApiError(404, "Feature request not found");
  }

  const isAdmin = req.user?.role === "admin";
  const isOwner = String(featureRequest.createdBy) === String(req.user?._id);

  if (!isAdmin && !isOwner) {
    throw new ApiError(403, "You are not allowed to delete this feature request");
  }

  await featureRequest.destroy();
  return sendResponse(res, 200, "Feature request deleted", null);
});

export const getFeatureRequestDashboard = asyncHandler(async (req, res) => {
  const items = await FeatureRequest.findAll({
    include: featureIncludes,
    order: [["created_at", "DESC"]],
  });

  const all = items.map((item) => serializeFeatureRequest(item));
  const statusMap = new Map();
  const priorityMap = new Map();

  for (const item of all) {
    statusMap.set(item.status, (statusMap.get(item.status) || 0) + 1);
    priorityMap.set(item.priority, (priorityMap.get(item.priority) || 0) + 1);
  }

  return sendResponse(res, 200, "Feature dashboard fetched", {
    kpis: {
      totalRequests: all.length,
      openRequests: all.filter((item) => item.status === "open").length,
      inProgressRequests: all.filter((item) => item.status === "in_progress").length,
      completedRequests: all.filter((item) => item.status === "completed").length,
      highPriorityRequests: all.filter((item) => item.priority === "high").length,
    },
    statusStats: Array.from(statusMap.entries()).map(([name, value]) => ({ name, value })),
    priorityStats: Array.from(priorityMap.entries()).map(([name, value]) => ({ name, value })),
    recentRequests: all.slice(0, 8),
  });
});
