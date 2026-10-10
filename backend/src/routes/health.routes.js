import { Router } from 'express';
import { isGeminiConfigured } from '../services/gemini.service.js';
import { ENV } from '../config/env.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    engine: 'ThirdEye Bystander Crisis Engine',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    aiStatus: isGeminiConfigured() ? 'gemini_active' : 'offline_heuristic',
    aiModel: ENV.GEMINI_MODEL
  });
});

export default router;
