import { Router } from 'express';
import { isGeminiConfigured } from '../services/gemini.service.js';
import { ENV } from '../config/env.js';

const router = Router();

router.get('/status', (req, res) => {
  res.json({
    engineMode: isGeminiConfigured() ? 'AI-Assisted (Gemini)' : 'Tactical Offline Simulation',
    aiConfigured: isGeminiConfigured(),
    model: isGeminiConfigured() ? ENV.GEMINI_MODEL : 'Local Heuristic Engine',
    fallbackEnabled: ENV.AI_FALLBACK_ENABLED,
    persistence: 'In-Memory State Session',
    version: '1.0.0-hackathon'
  });
});

export default router;
