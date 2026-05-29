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
 */
export function generateSequence(n: number): Token[] {
  const sequence: Token[] = [];
  
  for (let i = 0; i < n; i++) {
    let nextShape: Shape;
    let nextColor: Color;
    
    // Simple rejection sampling to avoid adjacent duplicates
    do {
      nextShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
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
export function getDeliverySchedule(sequence: Token[], deliveryMode: number): ChunkSchedule {
  const n = sequence.length;
  // Constant total exposure time, scale with N a bit so it's not impossible at high N
  const totalTimeMs = Math.max(3000, n * 1000); 

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
