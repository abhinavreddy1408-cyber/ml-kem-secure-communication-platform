// server/services/satelliteLinkService.ts
import { logger } from "../observability/logger.js";

export const satelliteLinkService = {
  latency: 250, // ms
  packetLoss: 0.01,
  bandwidth: 100, // Mbps
  linkHealth: 0.99,

  updateLink: () => {
    // Simulate link fluctuations
    satelliteLinkService.latency = 250 + Math.random() * 50;
    satelliteLinkService.packetLoss = 0.01 + Math.random() * 0.02;
    satelliteLinkService.linkHealth = 1.0 - satelliteLinkService.packetLoss;
    return { 
      latency: satelliteLinkService.latency, 
      packetLoss: satelliteLinkService.packetLoss, 
      linkHealth: satelliteLinkService.linkHealth 
    };
  },

  setParams: (latency?: number, packetLoss?: number) => {
    if (latency !== undefined) satelliteLinkService.latency = latency;
    if (packetLoss !== undefined) satelliteLinkService.packetLoss = packetLoss;
    logger.info(`Satellite link parameters updated: latency=${satelliteLinkService.latency}, packetLoss=${satelliteLinkService.packetLoss}`);
    return { success: true, latency: satelliteLinkService.latency, packetLoss: satelliteLinkService.packetLoss };
  },

  getState: () => ({
    latency: satelliteLinkService.latency,
    packetLoss: satelliteLinkService.packetLoss,
    bandwidth: satelliteLinkService.bandwidth,
    linkHealth: satelliteLinkService.linkHealth
  })
};
