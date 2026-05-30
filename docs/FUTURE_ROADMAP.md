# 🗺️ Future TODO / Roadmap

This document outlines the planned future enhancements for the Bottleneck application, focusing on accessibility, distribution, and broader usability.

## PWA Integration
To make the application feel like a native tool, we plan to fully configure the Vite PWA plugin.
- **Offline Capabilities:** The game logic and assets are small enough to be cached entirely via service workers, allowing users to play without an internet connection.
- **Installable:** Users should be able to "Add to Home Screen" on iOS and Android.

## Accessibility (a11y) Pass
The core experience relies heavily on visual information. We must ensure it is usable by as many people as possible.
- **Screen Reader Support:** Ensure that ARIA live regions announce the tokens during the presentation phase without disrupting the slider's pacing.
- **Keyboard Navigation:** While basic keyboard support might exist, the entire application flow—from the slider to the recall grid to the final takeaway—must be cleanly navigable via the Tab key.
- **Focus Management:** Explicitly manage focus states, especially during transitions between the game phases (Intro -> Presentation -> Recall -> Summary).

## Colorblind Modes
The current implementation relies on a combination of shapes and colors.
- **Native Color Themes:** We will implement distinct Tailwind themes tailored for Protanopia, Deuteranopia, and Tritanopia.
- **High Contrast Toggle:** A mode that removes all gradients, shadows, and subtle hues in favor of stark black/white/primary outlines.

## Procedural Audio Engine
Currently, audio relies on static sound files (if implemented at all).
- **Web Audio API:** Use native browser audio synthesis to generate tones.
- **Dynamic Pacing:** The pitch and tempo of the audio cues should match the speed set by the delivery slider, creating a rhythmic and cohesive feedback loop.

## Localization (i18n)
To expand the reach of the memory demonstrator, the UI strings must be decoupled from the code.
- **React-i18next:** Integrate an internationalization library to handle translations.
- **Dynamic Layouts:** Ensure the UI gracefully handles languages with longer average string lengths (e.g., German) or right-to-left (RTL) reading directions (e.g., Arabic).
