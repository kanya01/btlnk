# 🛠️ Technical & Architectural Improvements

To keep the codebase clean, scalable, and easy to maintain developmentally, the following architectural upgrades are recommended. As the application grows from a single-screen prototype to a more robust demonstrator, these changes will prevent technical debt.

## Finite State Machine (FSM)
The game currently relies on a string-based `phase` property in the Zustand store (`intro`, `presentation`, `recall`, etc.).
- **The Problem:** String-based state management is prone to impossible UI states (e.g., trying to submit a recall answer while the presentation is still running, or restarting the game while in the summary screen).
- **The Solution:** Migrate the core loop to a formal state machine using a library like **XState**. This will deeply formalize the transitions (`intro -> presentation -> recall -> result -> summary`) and make the application significantly more robust.

## Component Decoupling
Currently, the UI components are tightly coupled to the Zustand store, reading and writing state directly.
- **The Refactor:** Extract more pure game logic out of the UI components. Create a dedicated `hooks/` directory (e.g., `useGameEngine.ts`, `useSequence.ts`). This allows the components to simply consume the state and render, improving both testability and modularity.

## Unified Animation System
Framer Motion is used for layout transitions and token reveals.
- **The Problem:** Animation variants and configurations are likely scattered across different component files, leading to slight inconsistencies in the "feel" of the app.
- **The Solution:** Standardize all Framer Motion variants into a central `src/styles/animations.ts` file. This ensures that a "token reveal" always uses the exact same spring configuration, making the UI feel perfectly cohesive.

## Strict Testing Suite
A demonstrator relies on perfect reliability. If the sequence generation isn't truly random, or if the timing is slightly off, the core lesson fails.
- **Unit Testing:** Introduce **Vitest**. Write extensive unit tests for `gameEngine.ts` to guarantee that sequence generation, duplicate rejection, and delivery scheduling remain 100% deterministic.
- **Component Testing:** Use **React Testing Library** to ensure that accessibility features (like ARIA roles and keyboard navigation) work as expected without needing manual browser tests for every PR.

## Type Safety Enhancements
The `Token` type is currently somewhat rigid (`Shape`, `Color`).
- **Discriminated Unions:** Upgrade the token generation types. If we plan to add "joke" tokens (like the Hot Dog) or distinct token categories in the future, using discriminated unions in TypeScript will ensure the renderer always knows exactly what data it's dealing with, eliminating runtime rendering errors.

## Rendering Optimization
React can be overzealous with re-rendering when state changes frequently (like during a high-speed presentation phase).
- **Memoization:** Ensure heavy lists (like the history chart) and the `TokenView` component utilize `React.memo` and `useMemo` appropriately. This prevents unnecessary re-renders when the sequence gets long or when global variables (like the global speed modifier) are updated.
