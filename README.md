# ThirdEye — The Bystander Intervention Simulator

> **Tactical Civil Safety Console // Interactive Crisis De-escalation Training Platform**  
> Built with React + Vite, Pure CSS, Node.js + Express, and the Google Gemini API with Local Heuristic Engine Fallback.

---

## 1. Product Vision & Pedagogical Framework

**ThirdEye** is an interactive crisis de-escalation simulator designed to teach students, campus welfare officers, and community members how to safely apply the **5 Ds of Bystander Intervention**:

1. **DISTRACT**: Indirect deflection that disrupts aggression through everyday social interactions without direct conflict.
2. **DELEGATE**: Mobilizing institutional staff, transit drivers, security, or fellow bystanders to spread responsibility.
3. **DOCUMENT**: Discreetly preserving verifiable details (timestamps, carriage IDs, badge numbers) without compromising safety.
4. **DELAY**: Supportive aftercare and emotional validation for the affected person once immediate friction passes.
5. **DIRECT**: Setting clear, firm boundaries when safe to do so, avoiding violent escalation.

### Core Safety Principle
> **No intervention is universally safe.** User safety, the affected person's wishes, spatial confinement, and the potential for volatile retaliation supersede any single tactical score. ThirdEye is an educational training platform, not a substitute for professional security or emergency response services (911 / 112).

---

## 2. Architecture & Technology Stack

```
BRAVESTEPS/
├── backend/
│   ├── src/
│   │   ├── config/env.js            # Environment loader & validation
│   │   ├── data/scenarios.js        # High-fidelity scenarios & branching scenes
│   │   ├── services/
│   │   │   ├── gemini.service.js    # Gemini-backed intervention evaluation
│   │   │   ├── scenarioVideos.service.js # Gemini Google Search-grounded YouTube results
│   │   │   ├── heuristic.service.js # Local fallback classifier (English & Hinglish)
│   │   │   └── simulation.service.js# Deterministic state machine & readiness index
│   │   ├── schemas/simulation.schemas.js # Zod runtime request/response schemas
│   │   ├── middleware/              # Rate limiter, Zod validator, error handler
│   │   ├── routes/                  # Health, Config, Scenarios, Simulation, AI
│   │   ├── app.js                   # Express application setup with CORS & security
│   │   └── server.js                # Server entrypoint
│   └── tests/                       # Vitest & Supertest unit/integration test suites
├── frontend/
│   ├── src/
│   │   ├── components/              # TensionGauge, InterventionMatrix, FreeformResponder...
│   │   ├── pages/                   # Dashboard (Console) & About (Operational Dossier)
│   │   ├── services/                # API client with automatic offline fallback, Web Audio
│   │   ├── hooks/useSimulation.js   # Simulation telemetry and state lifecycle
│   │   └── styles/                  # Pure CSS Design System (tokens, global, layout, components)
│   └── tests/                       # Vitest + React Testing Library UI suite
└── scripts/dev.js                   # Concurrent development orchestration script
```

- **Frontend**: React 18, Vite 6, Pure CSS design tokens (No Tailwind CSS, no utility frameworks), Lucide React icons, Web Audio API procedural sound synthesis.
- **Backend**: Node.js (ES modules `"type": "module"`), Express, CORS, dotenv, Zod schema validation.
- **AI Integration**: Google Gemini API for structured intervention evaluation and Google Search-grounded YouTube recommendations in each scenario briefing. Video search results are restricted to validated YouTube links and embedded with privacy-enhanced YouTube embeds.
- **Local Fallback**: Transparent heuristic engine classifying English and Hinglish expressions with 100% zero-crash offline autonomy.
- **Deterministic Simulation Engine**: Clamped bounded telemetry (0–100) for Tension, Victim Safety Index, and Bystander Exposure. Transparent mathematical Readiness Index calculation.

---

## 3. Environment Variables Configuration

Copy `.env.example` in the `backend/` directory:

```bash
cp backend/.env.example backend/.env
```

| Variable | Requirement | Description | Default |
|---|---|---|---|
| `GEMINI_API_KEY` | **Optional** | Google Gemini API key. If omitted, simulation evaluation uses the local heuristic classifier and related-video search is disabled. | `""` |
| `GEMINI_MODEL` | Optional | Supported Gemini model name. | `gemini-2.5-flash` |
| `PORT` | Optional | Backend HTTP server port. | `5000` |
| `FRONTEND_ORIGIN` | Optional | Allowed CORS frontend origin. | `http://localhost:5173` |
| `MONGODB_URI` | Optional | Optional database URI. State operates in-memory by default. | `""` |
| `AI_FALLBACK_ENABLED` | Optional | Transparently switches to heuristic engine if API times out or reaches quota. | `true` |

Scenario briefings request related video results from `GET /api/scenarios/:id/videos`. This uses Gemini's Google Search grounding and requires a Gemini API key; no separate YouTube API key is needed. If the search is unavailable or returns no embeddable YouTube results, the briefing remains usable without videos.

---

## 4. Installation & Quickstart

### Step 1: Install Dependencies
```bash
npm run install:all
```

### Step 2: Run Development Suite Concurrently
```bash
npm run dev
```
* Backend starts at: `http://localhost:5000`
* Frontend console starts at: `http://localhost:5173`

Or run them individually in separate terminals:
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

---

## 5. Automated Test Suite & Verification Results

### Run All Tests
```bash
npm test
```

### Backend Test Results (23 Passed)
```bash
npm run test:backend
```
- **Scenario Definitions**: Confirmed 3 built-in scenarios (`metro`, `campus`, `bus_stop`), bounded telemetry (0–100), all 5 contextual labels, and multiple endings.
- **Deterministic State Engine**: Score clamping, transition matrices, delta calculations, primary intervention style classification.
- **Heuristic Classifier**: Verified English and Hinglish expressions (`"dhyan bhatkao"`, `"guard ko bulao"`, `"peeche hat"`).
- **API Endpoints**: Integration tests for `/api/health`, `/api/config/status`, `/api/scenarios`, `/api/simulation/start`, `/api/simulation/action`.

### Frontend Test Results (7 Passed)
```bash
npm run test:frontend
```
- Verified top telemetry bar rendering, live tension gauge, 5-D intervention matrix buttons, natural language responder, safety telemetry, and pedagogical dossier view.

### Production Build
```bash
npm run build
```
- Vite production bundle compiled in ~13s with zero warnings or errors.

---

## 6. Three High-Fidelity Built-in Scenarios

1. **Scenario A — Late Night Metro Car** (`metro`)
   * *Setting*: Confined underground carriage at 23:42 HRS.
   * *Dynamics*: Invasive crowding, intrusive questioning near exit doors.
   * *Branches*: Conversational distraction, allied passenger signaling, emergency intercom delegation, station platform timing.
   * *Endings*: Strategic De-escalation & Safe Exit, Institutional Delegation, Lockdown Emergency, Escalated Confrontation.

2. **Scenario B — University Library / Hallway** (`campus`)
   * *Setting*: Science Library 3rd floor quiet corridor at 16:15 HRS.
   * *Dynamics*: Aggressive physical path obstruction against locker bays.
   * *Branches*: Study review invitation, library desk report, open door visual guard, direct confrontation.
   * *Endings*: Atrium Cafe Sanctuary, Staff Protocol Resolution, Public Disciplinary Incident.

3. **Scenario C — Street Bus Stop** (`bus_stop`)
   * *Setting*: Curbside transit shelter at 21:10 HRS in rain.
   * *Dynamics*: Stranger interrogating solitary commuter for personal information.
   * *Branches*: Bus timetable inquiry, corner bodega merchant sanctuary, curb watch, direct confrontation.
   * *Endings*: Bodega Community Haven, Bus Boarding Safe Departure, Emergency Police Call.

---

## 7. 5-Minute Hackathon Demonstration Script

### Minute 0:00 – 1:00: The Problem & The Console
- Open `http://localhost:5173/`.
- Introduce the product: *"Harassment is an urgent societal challenge, yet traditional bystander training is either dry slide decks or generic text. ThirdEye is a tactical civil safety console that lets you practice the 5 Ds of bystander intervention in realistic crisis scenarios."*
- Highlight the **Tactical Incident-Room Design**: Deep obsidian console (`#0b0f17`), live SVG tension telemetry arc at 42%, victim safety index, and bystander exposure meter.

### Minute 1:00 – 2:00: Interactive 5-D Matrix Play
- In **Scenario A (Late Night Metro Car)**, point out the scenario constraints: confined space underground.
- Click **DISTRACT** (*"Ask for Station Destination"*).
- Watch the live telemetry respond:
  - Crisis Tension drops from 42% to 30%.
  - Victim Safety Index climbs to 74%.
  - Incident Theater logs the dialogue and simulated reaction.
- Show the **Risk Analysis** card updating with pros, cons, and tactical guidance.

### Minute 2:00 – 3:30: Natural Language Freeform Intervention
- Scroll down to the **Freeform Responder**.
- Type: *"I ask the commuter if she wants to swap seats so we can exit together at 8th street."*
- Click **Submit Action**.
- Highlight that the system evaluates the action, classifies it against the 5 Ds, and deterministically shifts the simulation.
- Show the **Gemini AI active badge** (or the **Local Heuristic Engine fallback** with Hinglish support).

### Minute 3:30 – 4:30: Ending Resolution & The Debrief Modal
- The scenario reaches its resolution: **Strategic De-escalation & Safe Exit**.
- The **Debrief Modal** opens:
  - **Readiness Index Score: 94/100** (grounded in safety preservation, not combat).
  - **Intervention Profile**: *"Strategic Deflector"*.
  - **Observed Strengths** & **Actionable Improvements**.
  - **Reflection Question**: Prompts genuine personal growth.

### Minute 4:30 – 5:00: Safety Principles & Architecture Recap
- Click the **Dossier** tab: Show the comprehensive educational breakdown and strict safety disclaimers.
- Open **Settings**: Demonstrate the sound synthesizer test, offline fallback toggle, and zero key leakage security model.
- Conclude: *"ThirdEye bridges theory and safety practice—empowering communities to protect each other safely."*

---

## 8. Limitations & Ethical Boundaries

1. **Simulation Model, Not Predictive Oracle**: ThirdEye does not predict real-world violence or guarantee real outcomes.
2. **Emergency Disclaimer**: In immediate threats of bodily harm, contact emergency services (911/112).
3. **Privacy First**: No real victim data, no recording of actual incidents, and zero persistence of private user inputs.
