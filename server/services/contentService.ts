// server/services/contentService.ts
import { db } from "../db/db.js";

export const contentService = {
  getContent: (section?: string) => {
    const content = db.get("content");
    if (section) return content[section];
    return content;
  },
  updateContent: (section: string, data: any) => {
    db.updateContent(section, data);
    return { success: true, section, data };
  }
};
