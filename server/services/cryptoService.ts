// server/services/cryptoService.ts
import { logger } from "../observability/logger.js";

export const cryptoService = {
  activeAlgorithm: "ML-KEM-1024",
  isSelectiveEncryption: true,
  keyIndex: 0,
  lastKey: "00000000000000000000000000000000",

  setAlgorithm: (algorithm: string) => {
    cryptoService.activeAlgorithm = algorithm;
    logger.info(`Crypto algorithm switched to ${algorithm}`);
    return { success: true, activeAlgorithm: cryptoService.activeAlgorithm };
  },

  toggleSelectiveEncryption: () => {
    cryptoService.isSelectiveEncryption = !cryptoService.isSelectiveEncryption;
    logger.info(`Selective encryption toggled to ${cryptoService.isSelectiveEncryption}`);
    return { success: true, isSelectiveEncryption: cryptoService.isSelectiveEncryption };
  },

  rotateKey: () => {
    cryptoService.keyIndex++;
    cryptoService.lastKey = Math.random().toString(16).substring(2, 18) + Math.random().toString(16).substring(2, 18);
    return { success: true, keyIndex: cryptoService.keyIndex, lastKey: cryptoService.lastKey };
  },

  getState: () => ({
    activeAlgorithm: cryptoService.activeAlgorithm,
    isSelectiveEncryption: cryptoService.isSelectiveEncryption,
    keyIndex: cryptoService.keyIndex,
    lastKey: cryptoService.lastKey
  })
};
