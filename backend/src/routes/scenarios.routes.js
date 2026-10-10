import { Router } from 'express';
import { SCENARIOS, getScenarioById } from '../data/scenarios.js';

const router = Router();

// GET all scenario summaries
router.get('/', (req, res) => {
  const summaries = SCENARIOS.map(s => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    location: s.location,
    environment: s.environment,
    bystanderProximity: s.bystanderProximity,
    initialTension: s.initialState.tension,
    initialVictimSafetyIndex: s.initialState.victimSafetyIndex,
    initialBystanderExposure: s.initialState.bystanderExposure,
    contextLabels: s.contextLabels
  }));

  res.json({
    count: summaries.length,
    scenarios: summaries
  });
});

// GET single scenario definition
router.get('/:id', (req, res) => {
  const scenario = getScenarioById(req.params.id);
  if (!scenario) {
    return res.status(404).json({
      error: 'SCENARIO_NOT_FOUND',
      message: `Scenario '${req.params.id}' does not exist.`
    });
  }

  res.json(scenario);
});

export default router;
