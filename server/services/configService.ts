// server/services/configService.ts
import { db } from "../db/db.js";

export const configService = {
  getConfig: () => db.get("config") as any,
  getPresets: () => (db.get("config") as any).presets,
  getFeatureFlags: () => (db.get("config") as any).featureFlags,
  updateFeatureFlag: (flag: string, value: boolean) => {
    const config = db.get("config") as any;
    config.featureFlags[flag] = value;
    db.set("config", config);
    return { success: true, flag, value };
  }
};

