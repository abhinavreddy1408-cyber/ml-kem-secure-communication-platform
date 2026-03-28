// server/services/submissionService.ts
import { db } from "../db/db.js";
import { logger } from "../observability/logger.js";

export const submissionService = {
  submit: (data: any) => {
    const submission = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      ...data
    };
    db.push("submissions", submission);
    logger.info("Form submission received", { submissionId: submission.id });
    return { success: true, message: "Submission received", id: submission.id };
  },
  getSubmissions: () => db.get("submissions")
};
