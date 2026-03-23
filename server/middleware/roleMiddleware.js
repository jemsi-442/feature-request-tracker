import { requireRole } from "./authMiddleware.js";

export const adminMiddleware = requireRole("admin");
