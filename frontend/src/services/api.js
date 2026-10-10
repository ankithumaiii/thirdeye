import { getScenarioById, SCENARIOS } from '../data/scenarios.js';

const API_BASE = '/api';

/**
 * Check backend health
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      engine: 'ThirdEye Local Offline Engine',
      aiStatus: 'offline_heuristic',
      aiModel: 'Local Heuristic Engine'
    };
  }
}

/**
 * Check config status
 */
export async function fetchConfigStatus() {
  try {
    const res = await fetch(`${API_BASE}/config/status`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      engineMode: 'Tactical Offline Simulation (Local)',
      aiConfigured: false,
      model: 'Local Heuristic Classifier',
      fallbackEnabled: true,
      persistence: 'Browser Local Storage'
    };
  }
}

/**
 * Fetch scenarios
 */
export async function fetchScenarios() {
  try {
    const res = await fetch(`${API_BASE}/scenarios`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.scenarios;
  } catch (err) {
    return SCENARIOS.map(s => ({
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
  }
}

/**
 * Start simulation
 */
export async function startSimulationApi(scenarioId) {
  try {
    const res = await fetch(`${API_BASE}/simulation/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenarioId }),
      signal: AbortSignal.timeout(4000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    // Client offline fallback
    const scenario = getScenarioById(scenarioId);
    const initialScene = scenario.scenes[scenario.initialState.sceneId];
    return {
      scenarioId: scenario.id,
      title: scenario.title,
      subtitle: scenario.subtitle,
      location: scenario.location,
      environment: scenario.environment,
      bystanderProximity: scenario.bystanderProximity,
      contextLabels: scenario.contextLabels,
      currentState: { ...scenario.initialState, sceneId: initialScene.id },
      currentScene: initialScene,
      actionHistory: [],
      behavioralCounts: { Distract: 0, Delegate: 0, Document: 0, Delay: 0, Direct: 0, None: 0 },
      isEnding: false,
      debrief: null
    };
  }
}

/**
 * Apply 5-D action
 */
export async function submitActionApi({
  scenarioId,
  sceneId,
  actionD,
  actionText,
  currentState,
  actionHistory = [],
  behavioralCounts = {}
}) {
  try {
    const res = await fetch(`${API_BASE}/simulation/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenarioId,
        sceneId,
        actionD,
        actionText,
        currentState,
        actionHistory,
        behavioralCounts
      }),
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    // Client deterministic calculation fallback
    return localApplyAction({
      scenarioId,
      sceneId,
      actionD,
      actionText,
      currentState,
      actionHistory,
      behavioralCounts
    });
  }
}

/**
 * Evaluate freeform intervention with Gemini API
 */
export async function evaluateFreeformApi({
  scenarioId,
  currentState,
  actionText,
  actionHistory = []
}) {
  try {
    const res = await fetch(`${API_BASE}/ai/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenarioId,
        currentState,
        actionText,
        actionHistory
      }),
      signal: AbortSignal.timeout(9000)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    // Local heuristic evaluation fallback
    return localClassifyText(actionText, scenarioId);
  }
}

/**
 * Client-side Heuristic Fallback
 */
function localClassifyText(text, scenarioId) {
  const lower = text.toLowerCase();
  let d = 'Distract';

  if (/call|guard|security|police|conductor|driver|librarian|bodega|shopkeeper|help desk/i.test(lower)) {
    d = 'Delegate';
  } else if (/record|video|photo|picture|note|badge|timestamp|log|camera/i.test(lower)) {
    d = 'Document';
  } else if (/wait|follow|check in|later|after|stay nearby|are you ok/i.test(lower)) {
    d = 'Delay';
  } else if (/stop|back off|leave|shout|confront|step aside|don't touch/i.test(lower)) {
    d = 'Direct';
  } else if (/ask|question|direction|time|table|umbrella|pretend/i.test(lower)) {
    d = 'Distract';
  }

  return {
    recognizedD: d,
    confidence: 0.82,
    source: 'heuristic',
    notice: 'Evaluated using client tactical heuristic classifier.',
    consequenceNarrative: `You initiated an intervention: "${text.slice(0, 120)}...". The aggressor pauses, noticing your deliberate presence.`,
    actionCritique: `Using ${d} alters the situation dynamics safely without resorting to uncontrolled violence.`,
    potentialBenefits: ['Interrupts the cycle of isolation', 'Demonstrates active community presence'],
    potentialRisks: ['Requires staying vigilant if friction persists'],
    recommendedNextStep: 'Guide the affected person to an open, monitored exit.'
  };
}

/**
 * Client-side Deterministic State Transition Fallback
 */
function localApplyAction({
  scenarioId,
  sceneId,
  actionD,
  actionText,
  currentState,
  actionHistory = [],
  behavioralCounts = {}
}) {
  const scenario = getScenarioById(scenarioId);
  const currentScene = scenario.scenes[sceneId] || scenario.scenes[scenario.initialState.sceneId];
  const option = currentScene.options ? currentScene.options[actionD] : null;

  let tensionDelta = option ? option.tensionDelta : -6;
  let safetyDelta = option ? option.safetyDelta : +10;
  let exposureDelta = option ? option.exposureDelta : +4;
  let targetSceneId = option ? option.targetSceneId : currentScene.id;

  const clamp = v => Math.max(0, Math.min(100, Math.round(v)));
  const newTension = clamp(currentState.tension + tensionDelta);
  const newSafety = clamp(currentState.victimSafetyIndex + safetyDelta);
  const newExposure = clamp(currentState.bystanderExposure + exposureDelta);
  const newTime = (currentState.timeElapsed || 0) + 45;

  const nextScene = scenario.scenes[targetSceneId] || currentScene;
  const isEnding = Boolean(nextScene.isEnding);

  const updatedCounts = {
    ...behavioralCounts,
    [actionD]: (behavioralCounts[actionD] || 0) + 1
  };

  const actionRecord = {
    id: `act_${Date.now()}`,
    d: actionD,
    actionText: actionText || (option ? option.actionText : `${actionD} intervention applied`),
    timestamp: new Date().toISOString(),
    timeElapsed: newTime,
    source: 'matrix',
    deltas: { tensionDelta, safetyDelta, exposureDelta },
    resultingTelemetry: {
      tension: newTension,
      victimSafetyIndex: newSafety,
      bystanderExposure: newExposure
    }
  };

  const debrief = isEnding ? {
    scenarioId: scenario.id,
    scenarioTitle: scenario.title,
    endingType: nextScene.endingType || 'Safe Conclusion',
    readinessScore: nextScene.readinessScore || clamp(0.4 * newSafety + 0.3 * (100 - newTension) + 0.2 * (100 - newExposure) + 10),
    interventionStyle: nextScene.interventionStyle || 'Strategic Deflector',
    finalTelemetry: { tension: newTension, victimSafetyIndex: newSafety, bystanderExposure: newExposure },
    behavioralCounts: updatedCounts,
    strengths: nextScene.strengths || ['Prioritized personal safety and de-escalation'],
    improvements: nextScene.improvements || ['Maintain clear exit paths in confined areas'],
    reflectionQuestion: nextScene.reflectionQuestion || 'How did this choice protect the affected person?'
  } : null;

  return {
    currentState: {
      tension: newTension,
      victimSafetyIndex: newSafety,
      bystanderExposure: newExposure,
      sceneId: nextScene.id,
      timeElapsed: newTime
    },
    currentScene: nextScene,
    actionRecord,
    actionHistory: [...actionHistory, actionRecord],
    behavioralCounts: updatedCounts,
    feedback: {
      recognizedD: actionD,
      consequenceNarrative: option ? option.actionText : nextScene.narrative,
      actionCritique: option ? option.critique : 'Intervention executed smoothly.',
      potentialBenefits: option ? option.potentialBenefits : ['Reduced immediate tension'],
      potentialRisks: option ? option.potentialRisks : ['Remain watchful'],
      recommendedNextStep: option ? option.recommendedNextStep : 'Continue observing until safe.',
      source: 'matrix'
    },
    isEnding,
    debrief
  };
}
