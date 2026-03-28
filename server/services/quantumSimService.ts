// server/services/quantumSimService.ts
import { logger } from "../observability/logger.js";

export const quantumSimService = {
  noiseLevel: 0.02,
  integrityError: 0.02,
  totalTransmitted: 0,
  totalEncapsulated: 0,
  totalErrors: 0,
  quantumStates: [] as any[],

  simulateBatch: (isEavesdropperActive: boolean, attackVector: string) => {
    const batchSize = 24;
    const currentBatch = [];
    let batchErrors = 0;
    let batchEncapsulations = 0;

    for (let i = 0; i < batchSize; i++) {
      quantumSimService.totalTransmitted++;
      const clientBit = Math.random() > 0.5 ? 1 : 0;
      const clientVector = Math.random() > 0.5 ? "+" : "x";
      
      let serverVector = Math.random() > 0.5 ? "+" : "x";
      let serverBit = clientBit;
      let eveVector = null;
      let eveBit = null;
      let wasIntercepted = false;

      if (isEavesdropperActive) {
        wasIntercepted = true;
        if (attackVector === "LATTICE_REDUCTION") {
          eveVector = Math.random() > 0.5 ? "+" : "x";
          eveBit = (eveVector === clientVector) ? clientBit : (Math.random() > 0.5 ? 1 : 0);
          serverBit = eveBit;
        } else if (attackVector === "SIDE_CHANNEL") {
          if (Math.random() < 0.1) serverBit = Math.random() > 0.5 ? 1 : 0;
        } else if (attackVector === "FAULT_INJECTION") {
          if (Math.random() < 0.15) serverBit = Math.random() > 0.5 ? 1 : 0;
          eveVector = clientVector;
          eveBit = clientBit;
        } else if (attackVector === "QUANTUM_BRUTE_FORCE") {
          if (Math.random() < 0.25) serverBit = Math.random() > 0.5 ? 1 : 0;
        }
      }

      if (Math.random() < quantumSimService.noiseLevel) {
        serverBit = Math.random() > 0.5 ? 1 : 0;
      }

      const vectorMatch = clientVector === serverVector;
      const isError = vectorMatch && clientBit !== serverBit;

      if (vectorMatch) {
        batchEncapsulations++;
        quantumSimService.totalEncapsulated++;
        if (isError) {
          batchErrors++;
          quantumSimService.totalErrors++;
        }
      }

      currentBatch.push({
        aliceBit: clientBit,
        aliceBasis: clientVector,
        bobBasis: serverVector,
        bobBit: serverBit,
        basisMatch: vectorMatch,
        isError,
        wasIntercepted,
        eveBasis: eveVector,
        eveBit
      });
    }

    quantumSimService.quantumStates = currentBatch;
    quantumSimService.integrityError = quantumSimService.totalEncapsulated > 0 ? quantumSimService.totalErrors / quantumSimService.totalEncapsulated : quantumSimService.noiseLevel;
    
    const validBits = Math.max(0, batchEncapsulations - batchErrors);
    return { validBits, quantumStates: currentBatch, integrityError: quantumSimService.integrityError };
  },

  setParams: (noiseLevel?: number) => {
    if (noiseLevel !== undefined) quantumSimService.noiseLevel = noiseLevel;
    logger.info(`ML-KEM simulation parameters updated: noiseLevel=${quantumSimService.noiseLevel}`);
    return { success: true, noiseLevel: quantumSimService.noiseLevel };
  },

  getState: () => ({
    noiseLevel: quantumSimService.noiseLevel,
    qber: quantumSimService.integrityError,
    totalTransmitted: quantumSimService.totalTransmitted,
    totalSifted: quantumSimService.totalEncapsulated,
    totalErrors: quantumSimService.totalErrors,
    quantumStates: quantumSimService.quantumStates
  })
};
