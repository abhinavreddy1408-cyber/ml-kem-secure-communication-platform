// server/services/threatModelService.ts
import { logger } from "../observability/logger.js";

export const threatModelService = {
  isEavesdropperActive: false,
  attackVector: "PNS", // PNS, INTERCEPT_RESEND, TROJAN_HORSE, PHASE_REMAPPING
  threatLevel: 0.1,

  activateEavesdropper: (duration: number = 5000) => {
    threatModelService.isEavesdropperActive = true;
    threatModelService.threatLevel = 0.8;
    logger.warn(`Eavesdropper activated: ${threatModelService.attackVector}`);
    
    setTimeout(() => {
      threatModelService.isEavesdropperActive = false;
      threatModelService.threatLevel = 0.1;
      logger.info(`Eavesdropper deactivated`);
    }, duration);
    
    return { success: true, isEavesdropperActive: true, threatLevel: 0.8 };
  },

  setAttackVector: (vector: string) => {
    threatModelService.attackVector = vector;
    logger.info(`Attack vector set to ${vector}`);
    return { success: true, attackVector: threatModelService.attackVector };
  },

  getState: () => ({
    isEavesdropperActive: threatModelService.isEavesdropperActive,
    attackVector: threatModelService.attackVector,
    threatLevel: threatModelService.threatLevel
  })
};
