// server/services/simulationService.ts
import { cryptoService } from "./cryptoService.js";
import { quantumSimService } from "./quantumSimService.js";
import { satelliteLinkService } from "./satelliteLinkService.js";
import { threatModelService } from "./threatModelService.js";
import { logger } from "../observability/logger.js";

export const simulationService = {
  isRunning: false,
  intervalId: null as any,
  siftedKeyRate: 0,

  start: () => {
    if (simulationService.isRunning) return;
    simulationService.isRunning = true;
    logger.info("Simulation Orchestrator started");

    simulationService.intervalId = setInterval(() => {
      // 1. Update Satellite Link
      satelliteLinkService.updateLink();

      // 2. Run Quantum Simulation Batch
      const { validBits } = quantumSimService.simulateBatch(
        threatModelService.isEavesdropperActive,
        threatModelService.attackVector
      );

      // 3. Update Crypto Engine (Key Index)
      cryptoService.keyIndex += validBits;
      simulationService.siftedKeyRate = validBits * 60; // Bits per second roughly

      // 4. Handle Key Rotation
      if (cryptoService.keyIndex % 512 === 0 && cryptoService.keyIndex > 0) {
        cryptoService.rotateKey();
        logger.info("Key rotation triggered by key index threshold");
      }

      // 5. Handle Crypto-Agility Switch (Auto-switch if Integrity Variance is too high)
      if (quantumSimService.integrityError > 0.15 && cryptoService.activeAlgorithm !== "ML-KEM-1024") {
        cryptoService.setAlgorithm("ML-KEM-1024");
        logger.warn("Automatic crypto-agility switch to ML-KEM-1024 due to high Integrity Variance");
      }

    }, 100);
  },

  stop: () => {
    if (!simulationService.isRunning) return;
    simulationService.isRunning = false;
    clearInterval(simulationService.intervalId);
    logger.info("Simulation Orchestrator stopped");
  },

  triggerScenario: (scenarioId: string) => {
    logger.info(`Triggering scenario: ${scenarioId}`);
    switch (scenarioId) {
      case "normal":
        threatModelService.isEavesdropperActive = false;
        quantumSimService.noiseLevel = 0.02;
        break;
      case "threat":
        threatModelService.activateEavesdropper(10000);
        break;
      case "refresh":
        cryptoService.rotateKey();
        break;
      case "crypto-agility":
        cryptoService.setAlgorithm(cryptoService.activeAlgorithm === "ML-KEM-1024" ? "Falcon-1024" : "ML-KEM-1024");
        break;
    }
    return { success: true, scenarioId };
  }
};
