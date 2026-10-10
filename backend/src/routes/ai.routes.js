import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { AIEvaluateRequestSchema } from '../schemas/simulation.schemas.js';
import { evaluateFreeformActionWithGemini } from '../services/gemini.service.js';

const router = Router();

// POST /api/ai/evaluate
router.post(
  '/evaluate',
  rateLimiter({ max: 40, windowMs: 60000, message: 'AI evaluation rate limit reached. Please wait a moment.' }),
  validateRequest(AIEvaluateRequestSchema),
  async (req, res, next) => {
    try {
      const { scenarioId, currentState, actionText, actionHistory } = req.validatedBody;

      const evaluation = await evaluateFreeformActionWithGemini({
        scenarioId,
        currentState,
        actionText,
        actionHistory
      });

      res.json(evaluation);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
