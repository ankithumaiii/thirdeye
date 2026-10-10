import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import { SimulationStartSchema, SimulationActionSchema } from '../schemas/simulation.schemas.js';
import { startSimulation, applyActionToState } from '../services/simulation.service.js';

const router = Router();

// POST /api/simulation/start
router.post('/start', validateRequest(SimulationStartSchema), (req, res, next) => {
  try {
    const { scenarioId } = req.validatedBody;
    const session = startSimulation(scenarioId);
    res.json(session);
  } catch (err) {
    next(err);
  }
});

// POST /api/simulation/action
router.post('/action', validateRequest(SimulationActionSchema), (req, res, next) => {
  try {
    const { scenarioId, sceneId, actionD, actionText, currentState } = req.validatedBody;
    const actionHistory = req.body.actionHistory || [];
    const behavioralCounts = req.body.behavioralCounts || {};

    const result = applyActionToState({
      scenarioId,
      currentSceneId: sceneId,
      actionD,
      customActionText: actionText,
      currentState,
      actionHistory,
      behavioralCounts
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
