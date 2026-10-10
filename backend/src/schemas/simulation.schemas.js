import { z } from 'zod';

export const FiveDEnum = z.enum(['Distract', 'Delegate', 'Document', 'Delay', 'Direct', 'None']);

export const CurrentStateSchema = z.object({
  tension: z.number().min(0).max(100),
  victimSafetyIndex: z.number().min(0).max(100),
  bystanderExposure: z.number().min(0).max(100),
  sceneId: z.string().optional(),
  timeElapsed: z.number().nonnegative().optional()
});

export const ActionStepSchema = z.object({
  id: z.string().optional(),
  d: FiveDEnum,
  actionText: z.string().min(1).max(1000),
  timestamp: z.string().optional(),
  source: z.enum(['matrix', 'freeform', 'heuristic', 'gemini']).default('matrix')
});

export const SimulationStartSchema = z.object({
  scenarioId: z.string().min(1)
});

export const SimulationActionSchema = z.object({
  scenarioId: z.string().min(1),
  sceneId: z.string().min(1),
  actionD: FiveDEnum,
  actionText: z.string().min(1).max(1000).optional(),
  currentState: CurrentStateSchema
});

export const AIEvaluateRequestSchema = z.object({
  scenarioId: z.string().min(1),
  currentState: CurrentStateSchema,
  actionText: z.string().min(3, "Action text must be at least 3 characters").max(1000, "Action text cannot exceed 1000 characters"),
  actionHistory: z.array(z.any()).optional().default([])
});

export const AIEvaluateResponseSchema = z.object({
  recognizedD: FiveDEnum,
  consequenceNarrative: z.string().min(5),
  actionCritique: z.string().min(5),
  potentialBenefits: z.array(z.string()).min(1),
  potentialRisks: z.array(z.string()).min(1),
  recommendedNextStep: z.string().min(5),
  confidence: z.number().min(0).max(1)
});
