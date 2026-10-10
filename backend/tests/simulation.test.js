import { describe, it, expect } from 'vitest';
import { SCENARIOS, getScenarioById } from '../src/data/scenarios.js';
import {
  clamp,
  calculateReadinessIndex,
  determineInterventionStyle,
  startSimulation,
  applyActionToState
} from '../src/services/simulation.service.js';
import { classifyTextHeuristically } from '../src/services/heuristic.service.js';
import { AIEvaluateResponseSchema } from '../src/schemas/simulation.schemas.js';

describe('Scenario Definitions Suite', () => {
  it('contains exactly 3 high-fidelity built-in scenarios', () => {
    expect(SCENARIOS).toHaveLength(3);
    const ids = SCENARIOS.map(s => s.id);
    expect(ids).toContain('metro');
    expect(ids).toContain('campus');
    expect(ids).toContain('bus_stop');
  });

  it('each scenario has initial telemetry bounded between 0 and 100', () => {
    SCENARIOS.forEach(scenario => {
      expect(scenario.initialState.tension).toBeGreaterThanOrEqual(0);
      expect(scenario.initialState.tension).toBeLessThanOrEqual(100);
      expect(scenario.initialState.victimSafetyIndex).toBeGreaterThanOrEqual(0);
      expect(scenario.initialState.victimSafetyIndex).toBeLessThanOrEqual(100);
      expect(scenario.initialState.bystanderExposure).toBeGreaterThanOrEqual(0);
      expect(scenario.initialState.bystanderExposure).toBeLessThanOrEqual(100);
    });
  });

  it('each scenario has all 5 contextual labels defined', () => {
    const requiredDs = ['Distract', 'Delegate', 'Document', 'Delay', 'Direct'];
    SCENARIOS.forEach(scenario => {
      requiredDs.forEach(d => {
        expect(scenario.contextLabels[d]).toBeDefined();
        expect(scenario.contextLabels[d].length).toBeGreaterThan(5);
      });
    });
  });

  it('each scenario has at least 2 distinct ending scenes', () => {
    SCENARIOS.forEach(scenario => {
      const endings = Object.values(scenario.scenes).filter(s => s.isEnding);
      expect(endings.length).toBeGreaterThanOrEqual(2);
      endings.forEach(ending => {
        expect(ending.endingType).toBeDefined();
        expect(ending.readinessScore).toBeGreaterThanOrEqual(0);
        expect(ending.readinessScore).toBeLessThanOrEqual(100);
      });
    });
  });
});

describe('Deterministic Simulation Engine Logic', () => {
  it('clamps scores correctly between 0 and 100', () => {
    expect(clamp(-15)).toBe(0);
    expect(clamp(115)).toBe(100);
    expect(clamp(45.6)).toBe(46);
  });

  it('starts a simulation with complete initial state and zero counts', () => {
    const session = startSimulation('metro');
    expect(session.scenarioId).toBe('metro');
    expect(session.currentState.tension).toBe(42);
    expect(session.currentState.victimSafetyIndex).toBe(58);
    expect(session.behavioralCounts.Distract).toBe(0);
    expect(session.actionHistory).toHaveLength(0);
    expect(session.isEnding).toBe(false);
  });

  it('applies standard Distract action and updates deltas deterministically', () => {
    const session = startSimulation('metro');
    const result = applyActionToState({
      scenarioId: 'metro',
      currentSceneId: session.currentScene.id,
      actionD: 'Distract',
      currentState: session.currentState,
      actionHistory: session.actionHistory,
      behavioralCounts: session.behavioralCounts
    });

    expect(result.currentState.tension).toBe(30); // 42 - 12
    expect(result.currentState.victimSafetyIndex).toBe(74); // 58 + 16
    expect(result.currentState.bystanderExposure).toBe(28); // 20 + 8
    expect(result.behavioralCounts.Distract).toBe(1);
    expect(result.actionHistory).toHaveLength(1);
    expect(result.currentScene.id).toBe('metro_distracted');
  });

  it('computes transparent readiness index according to defined formula', () => {
    const score = calculateReadinessIndex({
      victimSafetyIndex: 90,
      tension: 20,
      bystanderExposure: 15,
      behavioralCounts: { Distract: 2, Delegate: 1 },
      isEscalatedEnding: false
    });

    // 0.40*90 + 0.30*80 + 0.20*85 + 10 = 36 + 24 + 17 + 10 = 87
    expect(score).toBe(87);
  });

  it('penalizes aggressive direct confrontations in readiness index', () => {
    const scoreNormal = calculateReadinessIndex({
      victimSafetyIndex: 80,
      tension: 65,
      bystanderExposure: 50,
      behavioralCounts: { Distract: 1, Delay: 1 }
    });

    const scoreAggressive = calculateReadinessIndex({
      victimSafetyIndex: 80,
      tension: 65,
      bystanderExposure: 50,
      behavioralCounts: { Direct: 3 },
      isEscalatedEnding: true
    });

    expect(scoreNormal).toBeGreaterThan(scoreAggressive);
  });

  it('determines primary intervention styles accurately', () => {
    expect(determineInterventionStyle({ Distract: 3, Direct: 1 })).toBe('Strategic Deflector');
    expect(determineInterventionStyle({ Delegate: 4, Distract: 1 })).toBe('Authority Delegator');
    expect(determineInterventionStyle({ Delay: 2, Document: 1 })).toBe('Supportive Guardian');
    expect(determineInterventionStyle({ Direct: 3 })).toBe('Direct Shield');
  });
});

describe('Heuristic Classifier with Hinglish & English', () => {
  it('correctly classifies English distraction interventions', () => {
    const res = classifyTextHeuristically('I ask her what time the next train arrives', 'metro');
    expect(res.recognizedD).toBe('Distract');
    expect(res.confidence).toBeGreaterThanOrEqual(0.6);
  });

  it('correctly classifies English delegation to authority', () => {
    const res = classifyTextHeuristically('I call the security guard and inform the train conductor', 'metro');
    expect(res.recognizedD).toBe('Delegate');
  });

  it('correctly classifies Hinglish distraction expressions', () => {
    const res = classifyTextHeuristically('Main usse rasta poochta hoon aur dhyan bhatkao karta hoon', 'metro');
    expect(res.recognizedD).toBe('Distract');
  });

  it('correctly classifies Hinglish delegation expressions', () => {
    const res = classifyTextHeuristically('Police ko call karo aur guard ko bulao', 'campus');
    expect(res.recognizedD).toBe('Delegate');
  });

  it('correctly classifies Hinglish direct confrontation expressions', () => {
    const res = classifyTextHeuristically('Dur reh usse, hath mat laga, peeche hat!', 'bus_stop');
    expect(res.recognizedD).toBe('Direct');
  });

  it('matches AIEvaluateResponseSchema for fallback responses', () => {
    const res = classifyTextHeuristically('I ask if she wants to study together in room 201', 'campus');
    const validated = AIEvaluateResponseSchema.parse(res);
    expect(validated.recognizedD).toBe('Distract');
    expect(validated.potentialBenefits.length).toBeGreaterThan(0);
    expect(validated.potentialRisks.length).toBeGreaterThan(0);
  });
});
