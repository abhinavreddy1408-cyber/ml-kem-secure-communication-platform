// server/services/telemetryService.ts
import { cryptoService } from "./cryptoService.js";
import { quantumSimService } from "./quantumSimService.js";
import { satelliteLinkService } from "./satelliteLinkService.js";
import { threatModelService } from "./threatModelService.js";

export const telemetryService = {
  getTelemetry: () => {
    const cryptoState = cryptoService.getState();
    const quantumState = quantumSimService.getState();
    const satelliteState = satelliteLinkService.getState();
    const threatState = threatModelService.getState();

    return {
      timestamp: Date.now(),
      ...cryptoState,
      ...quantumState,
      ...satelliteState,
      ...threatState,
      // Derived metrics
      encryptionState: cryptoState.isSelectiveEncryption ? "Selective" : "Full",
      keyFreshness: Math.max(0, 1.0 - (cryptoState.keyIndex % 100) / 100),
      satelliteLinkHealth: satelliteState.linkHealth,
      simulationProgress: (quantumState.totalTransmitted % 1000) / 1000,
      alerts: threatState.isEavesdropperActive ? ["Attack Detected", "Lattice Noise Spike"] : [],
      success: quantumState.qber < 0.1
    };
  }
};
