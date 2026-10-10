import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchScenarios,
  startSimulationApi,
  submitActionApi,
  evaluateFreeformApi,
  checkBackendHealth,
  fetchConfigStatus
} from '../services/api.js';
import { getScenarioById, SCENARIOS } from '../data/scenarios.js';
import { soundFx } from '../services/audio.js';

export function useSimulation() {
  const [scenariosList, setScenariosList] = useState(SCENARIOS);
  const [currentScenarioId, setCurrentScenarioId] = useState('metro');
  const [scenario, setScenario] = useState(() => getScenarioById('metro'));
  const [currentScene, setCurrentScene] = useState(() => getScenarioById('metro').scenes.metro_entry);
  const [currentState, setCurrentState] = useState(() => getScenarioById('metro').initialState);

  const [events, setEvents] = useState(() => [
    {
      id: 'init_event_0',
      type: 'environment',
      tag: 'INCIDENT ENCOUNTERED',
      text: getScenarioById('metro').scenes.metro_entry.narrative,
      timestampText: 'T+00:00',
      telemetrySnapshot: { ...getScenarioById('metro').initialState }
    }
  ]);

  const [actionHistory, setActionHistory] = useState([]);
  const [behavioralCounts, setBehavioralCounts] = useState({
    Distract: 0,
    Delegate: 0,
    Document: 0,
    Delay: 0,
    Direct: 0,
    None: 0
  });

  const [feedback, setFeedback] = useState(null);
  const [lastDeltas, setLastDeltas] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastFeedbackSource, setLastFeedbackSource] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const lastSubmittedTextRef = useRef('');

  // Modals & UI states
  const [debrief, setDebrief] = useState(null);
  const [isDebriefOpen, setIsDebriefOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('simulator');
  const [isMuted, setIsMuted] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [backendStatus, setBackendStatus] = useState(null);
  const [configStatus, setConfigStatus] = useState(null);

  const addToast = useCallback((message, type = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync health & scenarios on mount
  useEffect(() => {
    checkBackendHealth().then((health) => {
      setBackendStatus(health);
      if (health.aiStatus === 'gemini_active') {
        addToast(`Gemini AI active (${health.aiModel})`, 'success');
      }
    });

    fetchConfigStatus().then(setConfigStatus);
    fetchScenarios().then((list) => {
      if (list && list.length > 0) setScenariosList(list);
    });
  }, [addToast]);

  // Audio mute sync
  const toggleMute = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
    if (!next) {
      soundFx.playActionClick();
      addToast('Synthesized procedural audio cues enabled', 'success');
    } else {
      addToast('Audio cues muted', 'info');
    }
  }, [isMuted, addToast]);

  const testSound = useCallback(() => {
    soundFx.setMuted(false);
    setIsMuted(false);
    soundFx.playDeescalation();
    addToast('Audio test sound played', 'success');
  }, [addToast]);

  // Start scenario
  const initializeScenario = useCallback(async (scenarioId) => {
    setIsProcessing(true);
    setErrorMessage(null);

    const fullScenario = getScenarioById(scenarioId);
    setScenario(fullScenario);
    setCurrentScenarioId(scenarioId);

    const session = await startSimulationApi(scenarioId);

    setCurrentScene(session.currentScene);
    setCurrentState(session.currentState);
    setActionHistory([]);
    setBehavioralCounts({
      Distract: 0,
      Delegate: 0,
      Document: 0,
      Delay: 0,
      Direct: 0,
      None: 0
    });
    setFeedback(null);
    setLastDeltas(null);
    setDebrief(null);
    setIsDebriefOpen(false);

    setEvents([
      {
        id: `init_${Date.now()}`,
        type: 'environment',
        tag: 'CRISIS SCENARIO COMMENCED',
        text: session.currentScene.narrative,
        timestampText: 'T+00:00',
        telemetrySnapshot: { ...session.currentState }
      }
    ]);

    setIsProcessing(false);
    addToast(`Commenced scenario: ${fullScenario.title}`, 'info');
  }, [addToast]);

  // Handle standard 5-D selection
  const handleSelectD = useCallback(async (d) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setErrorMessage(null);
    soundFx.playActionClick();

    const currentOption = currentScene.options ? currentScene.options[d] : null;
    const actionText = currentOption ? currentOption.actionText : `${d} intervention executed.`;

    // Optimistically log action event
    const timestampStr = `T+${String(currentState.timeElapsed + 45).padStart(3, '0')}s`;
    const actionEvtId = `evt_act_${Date.now()}`;

    setEvents((prev) => [
      ...prev,
      {
        id: actionEvtId,
        type: 'intervention',
        tag: `INTERVENTION [${d.toUpperCase()}]`,
        text: actionText,
        timestampText: timestampStr
      }
    ]);

    try {
      const result = await submitActionApi({
        scenarioId: currentScenarioId,
        sceneId: currentScene.id,
        actionD: d,
        actionText,
        currentState,
        actionHistory,
        behavioralCounts
      });

      // Sound feedback based on tension delta
      if (result.currentState.tension < currentState.tension) {
        soundFx.playDeescalation();
      } else if (result.currentState.tension > currentState.tension) {
        soundFx.playEscalation();
      }

      // Consequence narrative
      const consequenceText =
        result.feedback?.consequenceNarrative ||
        result.currentScene?.narrative ||
        'The crisis dynamic adapted to your intervention.';

      setEvents((prev) => [
        ...prev,
        {
          id: `evt_csq_${Date.now()}`,
          type: result.isEnding ? 'ending' : 'consequence',
          tag: result.isEnding ? 'INCIDENT CONCLUDED' : 'SIMULATED OUTCOME',
          text: consequenceText,
          timestampText: timestampStr,
          telemetrySnapshot: { ...result.currentState }
        }
      ]);

      setCurrentState(result.currentState);
      setCurrentScene(result.currentScene);
      setActionHistory(result.actionHistory);
      setBehavioralCounts(result.behavioralCounts);
      setFeedback(result.feedback);
      setLastDeltas(result.actionRecord?.deltas || null);
      setLastFeedbackSource(result.feedback?.source || 'matrix');

      if (result.isEnding && result.debrief) {
        setDebrief(result.debrief);
        setIsDebriefOpen(true);
        addToast(`Simulation reached resolution: ${result.debrief.endingType}`, 'success');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error processing intervention move');
      addToast('Intervention processing error. Retry available.', 'warning');
    } finally {
      setIsProcessing(false);
    }
  }, [
    isProcessing,
    currentScene,
    currentState,
    currentScenarioId,
    actionHistory,
    behavioralCounts,
    addToast
  ]);

  // Handle Freeform natural language intervention
  const handleFreeformSubmit = useCallback(async (freeformText) => {
    if (isProcessing || !freeformText) return;
    setIsProcessing(true);
    setErrorMessage(null);
    lastSubmittedTextRef.current = freeformText;
    soundFx.playActionClick();

    const timestampStr = `T+${String((currentState.timeElapsed || 0) + 45).padStart(3, '0')}s`;

    // Log freeform submission event
    setEvents((prev) => [
      ...prev,
      {
        id: `evt_ff_${Date.now()}`,
        type: 'intervention',
        tag: 'NATURAL LANGUAGE INTERVENTION',
        text: `"${freeformText}"`,
        timestampText: timestampStr
      }
    ]);

    try {
      // 1. Evaluate with Gemini (or fallback heuristic)
      const aiEval = await evaluateFreeformApi({
        scenarioId: currentScenarioId,
        currentState,
        actionText: freeformText,
        actionHistory
      });

      const recognizedD = aiEval.recognizedD === 'None' ? 'Distract' : aiEval.recognizedD;

      // 2. Deterministically apply to local simulation engine
      const result = await submitActionApi({
        scenarioId: currentScenarioId,
        sceneId: currentScene.id,
        actionD: recognizedD,
        actionText: freeformText,
        currentState,
        actionHistory,
        behavioralCounts
      });

      // Sound feedback
      if (result.currentState.tension < currentState.tension) {
        soundFx.playDeescalation();
      } else {
        soundFx.playEscalation();
      }

      // Consequence log
      setEvents((prev) => [
        ...prev,
        {
          id: `evt_csq_${Date.now()}`,
          type: result.isEnding ? 'ending' : 'consequence',
          tag: `EVALUATED AS [${aiEval.recognizedD.toUpperCase()}]`,
          text: aiEval.consequenceNarrative,
          timestampText: timestampStr,
          telemetrySnapshot: { ...result.currentState }
        }
      ]);

      setCurrentState(result.currentState);
      setCurrentScene(result.currentScene);
      setActionHistory(result.actionHistory);
      setBehavioralCounts(result.behavioralCounts);
      setFeedback({
        ...aiEval,
        recognizedD: aiEval.recognizedD
      });
      setLastDeltas(result.actionRecord?.deltas || null);
      setLastFeedbackSource(aiEval.source || 'gemini');

      if (result.isEnding && result.debrief) {
        setDebrief(result.debrief);
        setIsDebriefOpen(true);
        addToast(`Scenario resolved: ${result.debrief.endingType}`, 'success');
      } else {
        addToast(`Action classified as ${aiEval.recognizedD} (${Math.round(aiEval.confidence * 100)}% confidence)`, 'info');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Evaluation timed out or unavailable');
      addToast('AI evaluation failed; check connection or retry.', 'warning');
    } finally {
      setIsProcessing(false);
    }
  }, [
    isProcessing,
    currentState,
    currentScenarioId,
    currentScene,
    actionHistory,
    behavioralCounts,
    addToast
  ]);

  const retryLastFreeform = useCallback(() => {
    if (lastSubmittedTextRef.current) {
      handleFreeformSubmit(lastSubmittedTextRef.current);
    }
  }, [handleFreeformSubmit]);

  const resetSimulation = useCallback(() => {
    const hasProgress = actionHistory.length > 0;
    if (hasProgress) {
      const confirmReset = window.confirm(
        'Reset current simulation progress? All moves in this incident will be cleared.'
      );
      if (!confirmReset) return;
    }
    initializeScenario(currentScenarioId);
  }, [actionHistory.length, initializeScenario, currentScenarioId]);

  const clearPreferences = useCallback(() => {
    localStorage.clear();
    addToast('Preferences and local cache reset successfully', 'success');
  }, [addToast]);

  return {
    scenariosList,
    currentScenarioId,
    scenario,
    currentScene,
    currentState,
    events,
    actionHistory,
    behavioralCounts,
    feedback,
    lastDeltas,
    isProcessing,
    lastFeedbackSource,
    errorMessage,
    retryLastFreeform,
    debrief,
    isDebriefOpen,
    setIsDebriefOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    activeTab,
    setActiveTab,
    isMuted,
    toggleMute,
    testSound,
    toasts,
    dismissToast,
    backendStatus,
    configStatus,
    initializeScenario,
    handleSelectD,
    handleFreeformSubmit,
    resetSimulation,
    clearPreferences
  };
}
