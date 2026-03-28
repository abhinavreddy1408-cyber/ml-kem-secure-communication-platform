import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

// Import Services
import { contentService } from "./server/services/contentService.js";
import { simulationService } from "./server/services/simulationService.js";
import { cryptoService } from "./server/services/cryptoService.js";
import { telemetryService } from "./server/services/telemetryService.js";
import { submissionService } from "./server/services/submissionService.js";
import { configService } from "./server/services/configService.js";
import { quantumSimService } from "./server/services/quantumSimService.js";
import { satelliteLinkService } from "./server/services/satelliteLinkService.js";
import { threatModelService } from "./server/services/threatModelService.js";
import { logger } from "./server/observability/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  // Start Simulation Orchestrator
  simulationService.start();

  // --- WebSocket Broadcasting (Telemetry & Metrics Service) ---
  wss.on("connection", (ws) => {
    logger.info("Client connected to telemetry");
    
    const telemetryInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        const telemetry = telemetryService.getTelemetry();
        ws.send(JSON.stringify({
          type: "TELEMETRY",
          payload: {
            ...telemetry,
            siftedKeyRate: simulationService.siftedKeyRate
          }
        }));
      }
    }, 100);

    ws.on("close", () => {
      clearInterval(telemetryInterval);
      logger.info("Client disconnected from telemetry");
    });
  });

  // --- API Gateway / BFF Endpoints ---
  app.use(express.json());

  // 1. Content Service Routes
  app.get("/api/content", (req, res) => {
    res.json(contentService.getContent());
  });

  app.get("/api/content/:section", (req, res) => {
    res.json(contentService.getContent(req.params.section));
  });

  // 2. Simulation Orchestrator Routes
  app.post("/api/simulations/trigger", (req, res) => {
    const { scenarioId } = req.body;
    res.json(simulationService.triggerScenario(scenarioId));
  });

  app.post("/api/simulations/params", (req, res) => {
    const { noiseLevel, latency, packetLoss } = req.body;
    if (noiseLevel !== undefined) quantumSimService.setParams(noiseLevel);
    if (latency !== undefined || packetLoss !== undefined) satelliteLinkService.setParams(latency, packetLoss);
    res.json({ success: true });
  });

  // 3. Crypto Workflow Engine Routes
  app.post("/api/crypto/set-algorithm", (req, res) => {
    const { algorithm } = req.body;
    res.json(cryptoService.setAlgorithm(algorithm));
  });

  app.post("/api/crypto/toggle-encryption", (req, res) => {
    res.json(cryptoService.toggleSelectiveEncryption());
  });

  app.post("/api/crypto/rotate-key", (req, res) => {
    res.json(cryptoService.rotateKey());
  });

  // 4. Telemetry & Metrics Routes
  app.get("/api/status", (req, res) => {
    res.json(telemetryService.getTelemetry());
  });

  // 5. Submission Service Routes
  app.post("/api/contact", (req, res) => {
    res.json(submissionService.submit(req.body));
  });

  // 6. Config Service Routes
  app.get("/api/config", (req, res) => {
    res.json(configService.getConfig());
  });

  app.post("/api/config/feature-flag", (req, res) => {
    const { flag, value } = req.body;
    res.json(configService.updateFeatureFlag(flag, value));
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = 3000;
  server.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

