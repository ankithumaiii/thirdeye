import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App.jsx';

describe('ThirdEye Staged Progressive Simulator & UI Suite', () => {
  it('renders Netflix navigation bar with iconic brand logo and links', () => {
    render(<App />);
    expect(screen.getAllByText(/THIRDEYE/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /^Home$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Simulator$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Scenarios$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^The 5 Ds$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Readiness$/i })).toBeInTheDocument();
  });

  it('renders the vast Netflix homepage with billboard hero and trending rows', () => {
    render(<App initialTab="home" />);
    expect(screen.getByText(/TOP 1 TODAY/i)).toBeInTheDocument();
    expect(screen.getAllByText(/LATE NIGHT METRO CAR/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Trending Crisis Scenarios/i)).toBeInTheDocument();
    expect(screen.getByText(/Master the 5 Ds/i)).toBeInTheDocument();
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
  });

  it('clicking Play Scenario from homepage enters the progressive simulator briefing', () => {
    render(<App initialTab="home" />);
    const playBtn = screen.getByRole('button', { name: /Play Scenario/i });
    fireEvent.click(playBtn);

    expect(screen.getByText(/Operational Setup/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Encounter/i })).toBeInTheDocument();
  });

  it('progresses from briefing to encounter narrative and displays readable text', () => {
    render(<App initialTab="simulator" />);
    const startEncounterBtn = screen.getByRole('button', { name: /Start Encounter/i });
    fireEvent.click(startEncounterBtn);

    expect(screen.getByText(/Active Encounter/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Choose Your Response/i })).toBeInTheDocument();
  });

  it('opens intervention choice stage with all 5 Ds and enables confirm button on selection', () => {
    render(<App initialTab="simulator" />);
    // Step 2 -> 3
    fireEvent.click(screen.getByRole('button', { name: /Start Encounter/i }));
    // Step 3 -> 4
    fireEvent.click(screen.getByRole('button', { name: /Choose Your Response/i }));

    expect(screen.getByText(/What would you do\?/i)).toBeInTheDocument();
    expect(screen.getByText(/^DISTRACT$/i)).toBeInTheDocument();
    expect(screen.getByText(/^DELEGATE$/i)).toBeInTheDocument();
    expect(screen.getByText(/^DOCUMENT$/i)).toBeInTheDocument();
    expect(screen.getByText(/^DELAY$/i)).toBeInTheDocument();
    expect(screen.getByText(/^DIRECT$/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: /Confirm Response/i });
    expect(confirmBtn).toBeDisabled();

    // Select DISTRACT
    const distractCard = document.getElementById('btn-intervention-distract');
    fireEvent.click(distractCard);

    expect(confirmBtn).not.toBeDisabled();
  });

  it('confirming intervention applies action and reveals consequence stage', async () => {
    render(<App initialTab="simulator" />);
    fireEvent.click(screen.getByRole('button', { name: /Start Encounter/i }));
    fireEvent.click(screen.getByRole('button', { name: /Choose Your Response/i }));

    const distractCard = document.getElementById('btn-intervention-distract');
    fireEvent.click(distractCard);

    const confirmBtn = screen.getByRole('button', { name: /Confirm Response/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.getByText(/Simulated Consequence/i)).toBeInTheDocument();
      expect(screen.getByText(/Intervention Applied: Distract/i)).toBeInTheDocument();
    });
  });

  it('navigates to Dossier tab and displays safety disclaimers', () => {
    render(<App />);
    const dossierBtn = screen.getByRole('button', { name: /^Dossier$/i });
    fireEvent.click(dossierBtn);

    expect(screen.getByText(/Operational Dossier \/\/ Bystander Intervention/i)).toBeInTheDocument();
    expect(screen.getByText(/Primary Safety Mandate & Educational Disclaimer/i)).toBeInTheDocument();
  });
});
