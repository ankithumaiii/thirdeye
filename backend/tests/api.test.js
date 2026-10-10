import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Backend API Endpoints Integration', () => {
  it('GET /api/health returns health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.engine).toBe('ThirdEye Bystander Crisis Engine');
  });

  it('GET /api/config/status returns safe metadata without secrets', async () => {
    const res = await request(app).get('/api/config/status');
    expect(res.status).toBe(200);
    expect(res.body.engineMode).toBeDefined();
    expect(res.body.GEMINI_API_KEY).toBeUndefined(); // Verify secret not leaked!
  });

  it('GET /api/scenarios returns all scenario summaries', async () => {
    const res = await request(app).get('/api/scenarios');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(3);
    expect(res.body.scenarios).toHaveLength(3);
  });

  it('GET /api/scenarios/:id returns specific scenario', async () => {
    const res = await request(app).get('/api/scenarios/metro');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('metro');
    expect(res.body.scenes).toBeDefined();
  });

  it('GET /api/scenarios/:id returns 404 for unknown scenario', async () => {
    const res = await request(app).get('/api/scenarios/unknown_scene');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('SCENARIO_NOT_FOUND');
  });

  it('POST /api/simulation/start creates a new simulation session', async () => {
    const res = await request(app)
      .post('/api/simulation/start')
      .send({ scenarioId: 'campus' });

    expect(res.status).toBe(200);
    expect(res.body.scenarioId).toBe('campus');
    expect(res.body.currentState.tension).toBe(38);
    expect(res.body.currentScene).toBeDefined();
  });

  it('POST /api/simulation/action applies action and calculates next scene', async () => {
    const res = await request(app)
      .post('/api/simulation/action')
      .send({
        scenarioId: 'metro',
        sceneId: 'metro_entry',
        actionD: 'Distract',
        currentState: {
          tension: 42,
          victimSafetyIndex: 58,
          bystanderExposure: 20
        }
      });

    expect(res.status).toBe(200);
    expect(res.body.currentState.tension).toBe(30);
    expect(res.body.currentState.victimSafetyIndex).toBe(74);
    expect(res.body.actionHistory).toHaveLength(1);
  });
});
