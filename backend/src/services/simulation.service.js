import { SCENARIOS, getScenarioById } from '../data/scenarios.js';

export function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

/**
 * Calculates a transparent educational readiness score.
 * Formula balances:
 * - 40% Target Safety Preservation (victimSafetyIndex)
 * - 30% Tension Containment (100 - tension)
 * - 20% Bystander Exposure Management (100 - bystanderExposure)
 * - 10% Strategic Balance (diversity of non-violent de-escalation methods)
 */
export function calculateReadinessIndex({
  victimSafetyIndex,
  tension,
  bystanderExposure,
  behavioralCounts = {},
  isEscalatedEnding = false
}) {
  const safetyComponent = 0.40 * victimSafetyIndex;
  const tensionComponent = 0.30 * (100 - tension);
  const exposureComponent = 0.20 * (100 - bystanderExposure);

  // Bonus for prudent de-escalation styles (Distract, Delegate, Delay)
  const prudentCount = (behavioralCounts.Distract || 0) + (behavioralCounts.Delegate || 0) + (behavioralCounts.Delay || 0);
  const directCount = behavioralCounts.Direct || 0;
  
  let strategicBonus = 5;
  if (prudentCount >= 2) strategicBonus += 5;
  if (directCount > prudentCount && tension > 60) strategicBonus -= 15; // penalty for escalating conflict
  if (isEscalatedEnding) strategicBonus -= 10;

  const rawScore = safetyComponent + tensionComponent + exposureComponent + strategicBonus;
  return clamp(rawScore, 10, 99);
}

/**
 * Determines primary intervention style from action history
 */
export function determineInterventionStyle(counts = {}) {
  const styles = {
    Distract: 'Strategic Deflector',
    Delegate: 'Authority Delegator',
    Document: 'Forensic Observer',
    Delay: 'Supportive Guardian',
    Direct: 'Direct Shield'
  };

  let maxD = 'Distract';
  let maxCount = -1;
  let total = 0;

  for (const [d, count] of Object.entries(counts)) {
    total += count;
    if (count > maxCount) {
      maxCount = count;
      maxD = d;
    }
  }

  if (total === 0) return 'Cautious Observer';
  return styles[maxD] || 'Adaptive Responder';
}

/**
 * Starts a new simulation session for a scenario
 */
export function startSimulation(scenarioId) {
  const scenario = getScenarioById(scenarioId);
  if (!scenario) {
    throw new Error(`Scenario not found: ${scenarioId}`);
  }

  const initialScene = scenario.scenes[scenario.initialState.sceneId];

  return {
    scenarioId: scenario.id,
    title: scenario.title,
    subtitle: scenario.subtitle,
    location: scenario.location,
    environment: scenario.environment,
    bystanderProximity: scenario.bystanderProximity,
    contextLabels: scenario.contextLabels,
    currentState: {
      ...scenario.initialState,
      sceneId: initialScene.id
    },
    currentScene: initialScene,
    actionHistory: [],
    behavioralCounts: {
      Distract: 0,
      Delegate: 0,
      Document: 0,
      Delay: 0,
      Direct: 0,
      None: 0
    },
    isEnding: false,
    debrief: null
  };
}

/**
 * Deterministically applies an action to the current scenario state.
 */
export function applyActionToState({
  scenarioId,
  currentSceneId,
  actionD,
  customActionText = null,
  currentState,
  actionHistory = [],
  behavioralCounts = {},
  aiEvaluation = null
}) {
  const scenario = getScenarioById(scenarioId);
  if (!scenario) {
    throw new Error(`Scenario not found: ${scenarioId}`);
  }

  const currentScene = scenario.scenes[currentSceneId];
  if (!currentScene) {
    throw new Error(`Scene not found: ${currentSceneId} in scenario ${scenarioId}`);
  }

  // Find option matching actionD
  let option = currentScene.options ? currentScene.options[actionD] : null;

  // Fallback defaults if scene doesn't define exact D
  let tensionDelta = 0;
  let safetyDelta = 0;
  let exposureDelta = 0;
  let targetSceneId = currentScene.id;
  let critique = '';
  let benefits = ['Maintained situational presence'];
  let risks = ['Intervention outcome uncertain'];
  let nextStep = 'Assess whether the target is safe or needs physical exit assistance.';

  if (option) {
    tensionDelta = option.tensionDelta;
    safetyDelta = option.safetyDelta;
    exposureDelta = option.exposureDelta;
    targetSceneId = option.targetSceneId;
    critique = option.critique;
    benefits = option.potentialBenefits;
    risks = option.potentialRisks;
    nextStep = option.recommendedNextStep;
  } else {
    // Deterministic fallback for unlisted action D
    switch (actionD) {
      case 'Distract':
        tensionDelta = -10;
        safetyDelta = +12;
        exposureDelta = +5;
        critique = 'Distraction disrupted the incident momentum.';
        break;
      case 'Delegate':
        tensionDelta = -8;
        safetyDelta = +16;
        exposureDelta = -2;
        critique = 'Delegating mobilized supportive third parties.';
        break;
      case 'Document':
        tensionDelta = +2;
        safetyDelta = +4;
        exposureDelta = +2;
        critique = 'Discreet record preserved for institutional oversight.';
        break;
      case 'Delay':
        tensionDelta = -6;
        safetyDelta = +10;
        exposureDelta = +4;
        critique = 'Supportive check-in provided comforting aftercare.';
        break;
      case 'Direct':
        tensionDelta = +16;
        safetyDelta = +6;
        exposureDelta = +22;
        critique = 'Direct boundary asserted, but elevated tension.';
        break;
      default:
        tensionDelta = +4;
        safetyDelta = -4;
        exposureDelta = +6;
        critique = 'Unclassified action produced ambiguous results.';
        break;
    }
  }

  // Apply deterministic clamp
  const newTension = clamp(currentState.tension + tensionDelta);
  const newSafety = clamp(currentState.victimSafetyIndex + safetyDelta);
  const newExposure = clamp(currentState.bystanderExposure + exposureDelta);
  const newTimeElapsed = (currentState.timeElapsed || 0) + 45; // elapsed seconds per action

  // Next scene resolution
  let nextScene = scenario.scenes[targetSceneId] || currentScene;

  // Update behavioral counts
  const updatedCounts = {
    ...behavioralCounts,
    [actionD]: (behavioralCounts[actionD] || 0) + 1
  };

  // Determine if reached ending
  const isEnding = Boolean(nextScene.isEnding);

  // Build debrief if ending
  let debrief = null;
  if (isEnding) {
    const readinessScore = nextScene.readinessScore || calculateReadinessIndex({
      victimSafetyIndex: newSafety,
      tension: newTension,
      bystanderExposure: newExposure,
      behavioralCounts: updatedCounts,
      isEscalatedEnding: nextScene.endingType?.toLowerCase().includes('escalat')
    });

    const style = nextScene.interventionStyle || determineInterventionStyle(updatedCounts);

    debrief = {
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      endingType: nextScene.endingType || 'Simulation Concluded',
      readinessScore,
      interventionStyle: style,
      finalTelemetry: {
        tension: newTension,
        victimSafetyIndex: newSafety,
        bystanderExposure: newExposure
      },
      behavioralCounts: updatedCounts,
      strengths: nextScene.strengths || [
        'Maintained presence throughout the crisis event',
        'Attempted de-escalation actions to protect fellow citizen'
      ],
      improvements: nextScene.improvements || [
        'Prioritize low-friction distractions before entering direct confrontation',
        'Check in with victim autonomy and comfort after each incident'
      ],
      reflectionQuestion: nextScene.reflectionQuestion || 'What factors made this intervention safe or unsafe in this specific environment?'
    };
  }

  const actionRecord = {
    id: `action_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    d: actionD,
    actionText: customActionText || (option ? option.actionText : `${actionD} intervention initiated`),
    timestamp: new Date().toISOString(),
    timeElapsed: newTimeElapsed,
    source: aiEvaluation ? aiEvaluation.source : 'matrix',
    deltas: {
      tensionDelta,
      safetyDelta,
      exposureDelta
    },
    resultingTelemetry: {
      tension: newTension,
      victimSafetyIndex: newSafety,
      bystanderExposure: newExposure
    }
  };

  const updatedActionHistory = [...actionHistory, actionRecord];

  return {
    currentState: {
      tension: newTension,
      victimSafetyIndex: newSafety,
      bystanderExposure: newExposure,
      sceneId: nextScene.id,
      timeElapsed: newTimeElapsed
    },
    currentScene: nextScene,
    actionRecord,
    actionHistory: updatedActionHistory,
    behavioralCounts: updatedCounts,
    feedback: {
      recognizedD: actionD,
      consequenceNarrative: aiEvaluation?.consequenceNarrative || (option ? option.actionText : nextScene.narrative),
      actionCritique: aiEvaluation?.actionCritique || critique,
      potentialBenefits: aiEvaluation?.potentialBenefits || benefits,
      potentialRisks: aiEvaluation?.potentialRisks || risks,
      recommendedNextStep: aiEvaluation?.recommendedNextStep || nextStep,
      source: aiEvaluation ? aiEvaluation.source : 'matrix'
    },
    isEnding,
    debrief
  };
}
