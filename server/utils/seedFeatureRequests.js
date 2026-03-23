import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { FeatureRequest, User } from "../models/index.js";

dotenv.config();

const SAMPLE_REQUESTS = [
  {
    title: "Add export to CSV",
    description:
      "Admins should be able to export the feature request list as CSV for reporting and offline review.",
    priority: "high",
    status: "open",
  },
  {
    title: "Email notifications for admins",
    description:
      "Send email alerts to administrators whenever a new feature request is submitted by a user.",
    priority: "medium",
    status: "in_progress",
  },
  {
    title: "Dashboard filters by status",
    description:
      "Allow dashboard widgets and request tables to be filtered by request status for faster tracking.",
    priority: "high",
    status: "completed",
  },
  {
    title: "Attachment support on requests",
    description:
      "Users should be able to attach screenshots or supporting files when submitting feature requests.",
    priority: "medium",
    status: "open",
  },
  {
    title: "Internal comment history",
    description:
      "Add a comment timeline so admins can leave progress notes and context on each feature request.",
    priority: "medium",
    status: "in_progress",
  },
  {
    title: "Date range search",
    description:
      "Users and admins should be able to search feature requests using a created date range filter.",
    priority: "low",
    status: "open",
  },
  {
    title: "Show request owner on cards",
    description:
      "Each request card should clearly display the creator name and submission date for quick visibility.",
    priority: "low",
    status: "completed",
  },
  {
    title: "Status change audit trail",
    description:
      "Record every feature request status change with timestamp and responsible admin for accountability.",
    priority: "high",
    status: "in_progress",
  },
];

const seedFeatureRequests = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@feature-request-tracker.local";
  const admin = await User.findOne({ where: { email: adminEmail } });

  if (!admin) {
    throw new Error(`Admin account not found for ${adminEmail}. Run npm run create-admin first.`);
  }

  let created = 0;

  for (const request of SAMPLE_REQUESTS) {
    const existing = await FeatureRequest.findOne({ where: { title: request.title } });
    if (existing) {
      continue;
    }

    await FeatureRequest.create({
      ...request,
      createdBy: admin.id,
      updatedBy: admin.id,
    });
    created += 1;
  }

  return created;
};

const run = async () => {
  try {
    await connectDB();
    const created = await seedFeatureRequests();
    console.log(
      created > 0
        ? `Seeded ${created} feature request(s) successfully.`
        : "No new feature requests were seeded because the sample data already exists."
    );
    process.exit(0);
  } catch (error) {
    console.error("Error seeding feature requests:", error.message);
    process.exit(1);
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  run();
}
