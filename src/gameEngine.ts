export type Shape = 'circle' | 'square' | 'triangle' | 'star';
export type Color = 'red' | 'blue' | 'green' | 'yellow';

export interface Token {
  id: string; // unique id for rendering
  shape: Shape;
  color: Color;
}

const SHAPES: Shape[] = ['circle', 'square', 'triangle', 'star'];
const COLORS: Color[] = ['red', 'blue', 'green', 'yellow'];

/**
 * Generates a random sequence of tokens of length `n`.
 * Ensures no two adjacent tokens are identical in both shape and color.
 * If `easyMode` is true, only circles are used.
 */
export function generateSequence(n: number, easyMode: boolean = false): Token[] {
  const sequence: Token[] = [];
  
  for (let i = 0; i < n; i++) {
    let nextShape: Shape;
    let nextColor: Color;
    
    // Simple rejection sampling to avoid adjacent duplicates
    do {
      nextShape = easyMode ? 'circle' : SHAPES[Math.floor(Math.random() * SHAPES.length)];
      nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    } while (
      i > 0 && 
      sequence[i - 1].shape === nextShape && 
      sequence[i - 1].color === nextColor
    );

    sequence.push({
      id: `token-${i}-${Date.now()}`,
      shape: nextShape,
      color: nextColor
    });
  }
  
  return sequence;
}

export interface ChunkSchedule {
  chunks: Token[][];
  intervalMs: number; // Time between chunks
  exposureMs: number; // Total time tokens are visible
}

/**
 * Maps the slider value (0-1) to a delivery schedule.
 * Total study time should remain roughly constant.
 * 
 * Base assumption: Let's say total exposure is 3000ms.
 * - Mode 0 (All at once): 1 chunk of size N, visible for 3000ms.
 * - Mode 1 (Bit by bit): N chunks of size 1, visible for 3000ms / N each.
 * - Mode 0.5 (Chunked): ~N/2 chunks.
 */
export function getDeliverySchedule(sequence: Token[], deliveryMode: number, speed: number = 1.0): ChunkSchedule {
  const n = sequence.length;
  // Constant total exposure time, scale with N a bit so it's not impossible at high N, adjust by speed
  const totalTimeMs = Math.max(3000, n * 1000) / speed; 

  // Determine chunk size based on delivery mode
  // mode 0 => chunk size = n
  // mode 1 => chunk size = 1
  const chunkSizeFloat = n - (n - 1) * deliveryMode;
  const chunkSize = Math.max(1, Math.round(chunkSizeFloat));

  const chunks: Token[][] = [];
  for (let i = 0; i < n; i += chunkSize) {
    chunks.push(sequence.slice(i, i + chunkSize));
  }

  const numChunks = chunks.length;
  const timePerChunk = totalTimeMs / numChunks;
  
  // Interval is a small gap between chunks, exposure is the remaining time
  const gapMs = numChunks > 1 ? 200 : 0; 
  const exposureMs = timePerChunk - gapMs;

  return {
    chunks,
    intervalMs: gapMs,
    exposureMs
  };
}

/**
 * Validates the user input against the actual sequence.
 */
export function validateRecall(expected: Token[], actual: Token[]): boolean {
  if (expected.length !== actual.length) return false;
  
  for (let i = 0; i < expected.length; i++) {
    if (expected[i].shape !== actual[i].shape || expected[i].color !== actual[i].color) {
      return false;
    }
  }
  
  return true;
}

/**
 * Calculates Synapse XP based on various run parameters.
 * - span: sequence length correctly recalled
 * - speed: presentation speed (0.5 to 2.0)
 * - easyMode: true if simplified complexity
 * - deliveryMode: chunking factor (0.0 = all at once, 1.0 = bit by bit)
 * - avgReactionTime: average reaction time in ms
 * - avgHesitation: average hesitation time between tokens in ms
 */
export function calculateSynapseXP(
  span: number,
  speed: number,
  easyMode: boolean,
  deliveryMode: number,
  avgReactionTime: number,
  avgHesitation: number
): number {
  if (span < 1) return 0;

  // Exponential base points: goes up meaningfully with more sequence steps
  const basePoints = 100 * Math.pow(1.4, span);

  // Multipliers for settings
  const speedMultiplier = speed; // e.g. 2.0 speed = 2x XP
  const complexityMultiplier = easyMode ? 0.8 : 1.5; // Bonus for complex mode
  
  // Delivery mode: 0 (all at once, relies on visual chunking) gets up to 1.4x bonus
  const chunkingMultiplier = 1.0 + (1.0 - deliveryMode) * 0.4; 

  // Performance Multiplier: rewards fast and fluid recall
  const safeRt = Math.max(200, avgReactionTime || 2000);
  const safeHes = Math.max(100, avgHesitation || 1000);

  // Normalize around standard values: 1500ms reaction, 800ms hesitation
  const rtFactor = Math.min(2.0, 1500 / safeRt);
  const hesFactor = Math.min(2.0, 800 / safeHes);
  const performanceMultiplier = (rtFactor + hesFactor) / 2;

  return Math.round(
    basePoints * speedMultiplier * complexityMultiplier * chunkingMultiplier * performanceMultiplier
  );
}
