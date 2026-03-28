import { useState, useEffect, useCallback } from 'react';

export interface QuantumState {
  aliceBit: number;
  aliceBasis: string;
  bobBasis: string;
  bobBit: number;
  basisMatch: boolean;
  isError: boolean;
  wasIntercepted?: boolean;
  eveBasis?: string | null;
  eveBit?: number | null;
}

export interface TelemetryData {
  keyIndex: number;
  lastKey: string;
  qber: number;
  isSelectiveEncryption: boolean;
  activeAlgorithm: string;
  isEavesdropperActive: boolean;
  attackVector: string;
  noiseLevel: number;
  quantumStates: QuantumState[];
  siftedKeyRate: number;
  totalTransmitted: number;
  totalSifted: number;
  totalErrors: number;
  timestamp: number;
}

export function useTelemetry() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => setStatus('connected');
    ws.onclose = () => setStatus('disconnected');
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'TELEMETRY') {
          setData(message.payload);
        }
      } catch (err) {
        console.error('Failed to parse telemetry message', err);
      }
    };

    return () => ws.close();
  }, []);

  const toggleEncryption = useCallback(async () => {
    await fetch('/api/crypto/toggle-encryption', { method: 'POST' });
  }, []);

  const setAlgorithm = useCallback(async (algorithm: string) => {
    await fetch('/api/crypto/set-algorithm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ algorithm }),
    });
  }, []);

  const setSimulationParams = useCallback(async (params: { noiseLevel?: number; attackVector?: string }) => {
    await fetch('/api/simulations/params', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  }, []);

  const simulateEavesdropper = useCallback(async () => {
    await fetch('/api/simulations/trigger', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenarioId: 'threat' }),
    });
  }, []);


  return { data, status, toggleEncryption, setAlgorithm, setSimulationParams, simulateEavesdropper };
}
