import React from 'react';
import IncidentTheater from '../components/IncidentTheater.jsx';
import InterventionMatrix from '../components/InterventionMatrix.jsx';
import FreeformResponder from '../components/FreeformResponder.jsx';
import SafetyTelemetry from '../components/SafetyTelemetry.jsx';
import RiskAnalysis from '../components/RiskAnalysis.jsx';
import ActionHistory from '../components/ActionHistory.jsx';

export default function Dashboard({
  scenario,
  currentScene,
  currentState,
  events,
  actionHistory,
  behavioralCounts,
  feedback,
  lastDeltas,
  isProcessing,
  onSelectD,
  onSubmitFreeform,
  lastFeedbackSource,
  errorMessage,
  onRetry
}) {
  return (
    <main className="simulation-main-content">
      {/* Left Incident Column (Narrative & Controls) */}
      <div className="incident-column">
        {/* Incident Theater */}
        <IncidentTheater
          scenario={scenario}
          currentScene={currentScene}
          events={events}
        />

        {/* 5-D Intervention Matrix */}
        <InterventionMatrix
          scenario={scenario}
          currentScene={currentScene}
          onSelectD={onSelectD}
          isProcessing={isProcessing}
        />

        {/* Freeform Responder */}
        <FreeformResponder
          onSubmitFreeform={onSubmitFreeform}
          isProcessing={isProcessing}
          lastFeedbackSource={lastFeedbackSource}
          errorMessage={errorMessage}
          onRetry={onRetry}
        />
      </div>

      {/* Right Telemetry Column (Safety, Profile, Risk Analysis, Log) */}
      <div className="telemetry-column">
        {/* Safety & Exposure Telemetry + 5D Bar Chart */}
        <SafetyTelemetry
          victimSafetyIndex={currentState.victimSafetyIndex}
          bystanderExposure={currentState.bystanderExposure}
          behavioralCounts={behavioralCounts}
          lastDeltas={lastDeltas}
        />

        {/* Risk Analysis & Tactical Guidance */}
        <RiskAnalysis
          feedback={feedback}
          scenario={scenario}
          currentScene={currentScene}
        />

        {/* Action Log History */}
        <ActionHistory actionHistory={actionHistory} />
      </div>
    </main>
  );
}
