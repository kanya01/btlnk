# Bottleneck Product Requirements Document

## Overview

Bottleneck is a one-screen, local-first browser game that demonstrates a working-memory bottleneck and the effect of segmented delivery on recall performance through direct interaction rather than explanation [file:1][cite:3]. The player performs the same recall task repeatedly while changing only one meaningful variable, the delivery slider, so the difference between “all at once” and “bit by bit” becomes experiential rather than theoretical [file:1][cite:3].

The product should function as a compact interactive proof of the idea that delivery, not effort alone, changes performance on the same underlying task [file:1][cite:3]. The interface and feature set should remain highly constrained so that the learning effect stays legible and the product never drifts into a general-purpose game or training app [cite:3].

## Product goal

The goal of version 1 is to let a first-time user feel the contrast between high-density and segmented presentation in under two minutes, with no tutorial and minimal on-screen explanation [file:1][cite:3]. The experience should be persuasive because the player personally notices a change in span across delivery styles, not because the application explains a theory in words [file:1][cite:3].

A successful session should leave the user with two clear impressions: their apparent limit changes depending on presentation style, and this matters for how information should be designed, taught, or sequenced [file:1][cite:3].

## Non-goals

Version 1 is not a social game, benchmark platform, educational curriculum, or research dashboard [cite:3]. It should not include accounts, remote data storage, analytics tracking, leaderboards, settings-heavy customization, multiple independent difficulty systems, or tutorial flows beyond the basic interaction itself [cite:3].

It also should not attempt to model the entire domain of memory science. The product only needs to make one contrast legible: same task, different delivery, different result [file:1][cite:3].

## Target user

The primary user is a first-time visitor on mobile or desktop who can immediately understand a simple interaction but may know nothing about memory research [cite:3]. A secondary user is a designer, educator, researcher, or product person who wants to use the experience as a compact demonstration of why pacing and segmentation matter [file:1][cite:3].

The application must therefore feel intuitive to a casual player while still being precise enough for a design-minded audience to treat it as a meaningful demonstration [cite:3].

## Product principles

The design should follow these core principles:

- One meaningful control: the delivery slider is the only strategic variable [cite:3].
- Same task, different delivery: the task structure remains constant while segmentation and pacing vary [cite:3].
- Learn by doing: the insight should emerge from repeated play, not from explanatory text [file:1][cite:3].
- Restraint over features: every feature must make the slider’s lesson land harder, or it does not ship [file:1][cite:3].
- Fast, calm, local-first interaction: the app should load instantly, feel uncluttered, and keep data on device only [cite:3].

## Core game loop

The central loop is a memory-span task. A sequence of items is shown, the sequence disappears, the player reproduces it, and the game increases sequence length after success or ends the run after failure [file:1][cite:3]. The main performance measure is the highest sequence length correctly recalled within a run, referred to as span in the source spec [file:1][cite:3].

The user should be encouraged to replay at multiple slider positions. The product’s real outcome is not a single score but the player’s felt and visible contrast in performance across delivery modes [cite:3].

## Sequence specification

Version 1 should support mixed visual tokens composed of shape and color attributes rather than digits only. On each turn, the active sequence is generated from token combinations that may vary in shape, color, or both, so the task remains perceptually fresh across repeated attempts.

The generation rule should follow the clarified product decision: shape and color may remain the same across repeated failed attempts within a run, and once the user gets the sequence right, the next successful progression may introduce a change in shape, color, or both. This preserves continuity during struggle while still allowing variety after success.

### Token behavior rules

| Rule area | Requirement |
|---|---|
| Token model | Each item is a token with at least two visual properties: `shape` and `color` |
| Within a failed retry cycle | The same token set may be retained so the user is not forced to relearn presentation variables while still trying to succeed |
| After a correct answer | The next progression may keep one attribute the same and change the other, or change both |
| Allowed change pattern | Shape-only change, color-only change, or shape-and-color change |
| Design intent | Keep the task varied over time without adding unnecessary novelty while the player is already failing |

To keep recall focused on sequence rather than semantic interpretation, the number of shapes and colors in v1 should remain small and visually distinct. A good default is 4 shapes and 4 colors, producing enough variety without making the stimuli visually noisy.

## Input specification

The game must support both typed entry and tap entry, matching the clarified product decision. On desktop, users should be able to reproduce the sequence through direct keyboard input where appropriate, and on touch devices or in general UI mode they should be able to use large tappable controls.

Because the sequence is shape-and-color based rather than numeric only, the tap input should be considered the primary universal mode. Typed input may be implemented through compact token shortcuts or mapped keys if doing so preserves clarity, but tap interaction must always remain available.

### Input requirements

- Touch-first tap entry with large targets is mandatory.
- Keyboard interaction is mandatory for accessibility and desktop usability [cite:3].
- Visible focus states must be preserved for all interactive controls [cite:3].
- Current answer progress must remain visible before submission.
- Users must be able to delete or reset their current answer before submitting.

## Error handling and retry logic

A single mistake should fail the run immediately, consistent with the clarified decision. The intent is for the player to keep replaying until they succeed and then observe how difficulty and delivery mode influence their performance across runs.

The run should therefore operate on strict pass/fail logic with no partial credit and no within-round tolerance. However, the overall product rhythm should encourage immediate replay rather than framing failure as punishment. The summary screen should present failure calmly and direct the user toward another attempt or another slider position.

### Failure behavior

| Event | Result |
|---|---|
| Incorrect submission in a round | Run ends immediately |
| First failed run | User sees current span and is prompted to try again |
| Repeated failures | User may replay at the same slider setting or move the slider |
| Product intent | Failure is part of the lesson, not a dead end |

This structure is important because it keeps the evidence legible: under harder delivery conditions, users should experience more abrupt failure and lower span, then discover through repetition that the slider changes that outcome.

## Difficulty curve

The source spec states that correct rounds increase sequence length by one, but the clarified decision leaves open whether that should remain fixed permanently [file:1][cite:3]. For v1, the recommended rule is a simple linear progression where \(N\) increases by 1 after every successful round.

This recommendation is preferable because it keeps the game intelligible, easy to test, and aligned with the product’s minimalism. Variable step sizes can be revisited later if playtesting shows that the curve feels too flat or too abrupt, but v1 should not introduce a second invisible difficulty system beyond the delivery slider.

### Recommended v1 rule

- Start round length at a low, readable baseline such as 3 items.
- Increase \(N\) by 1 after each correct answer.
- End the run immediately on any incorrect answer.
- Record the highest completed \(N\) as the player’s span for that run [cite:3].

## Delivery slider specification

The slider remains the heart of the product and must be tightly defined. It ranges from 0 to 1, where 0 represents “all at once” delivery and 1 represents “bit by bit” delivery [cite:3]. Intermediate values represent progressively more segmented and paced presentation [cite:3].

The slider must only affect presentation schedule, not the underlying sequence content or total information payload [cite:3]. Total study time should remain constant across the slider range so that only segmentation and pacing change, which preserves the fairness of the comparison and the validity of the intended lesson [cite:3].

### Delivery modes

| Slider range | Mode label | Presentation behavior | Expected effect |
|---|---|---|---|
| 0.00-0.20 | All at once | Whole sequence appears in a single burst for a fixed exposure window | Hardest condition; effort alone should feel insufficient [cite:3] |
| 0.21-0.60 | Chunked | Sequence is grouped into smaller chunks with light pacing | Moderate increase in legibility and recall [cite:3] |
| 0.61-1.00 | Bit by bit | Sequence is revealed in very small chunks or one item at a time | Highest expected span and clearest ease effect [cite:3] |

Slider mapping should be deterministic at the implementation level. Given the same sequence and slider position, the same reveal schedule should always be produced so the system remains testable and behaviorally consistent.

## Screens and states

The product should use the five user-visible states already proposed in the source outline: intro, presentation, recall, result, and summary/takeaway [cite:3]. These can be implemented as discrete screens or tightly controlled phase transitions within one screen, but they must remain legible as different moments in the loop [cite:3].

### State descriptions

- Intro: a one-line invitation to start, with no tutorial burden [cite:3].
- Presentation: the sequence is shown according to the current delivery schedule [cite:3].
- Recall: the player enters the remembered sequence.
- Result: a brief pass/fail beat indicating what happened [cite:3].
- Summary: the user sees their span for that run, any relevant curve view, and a prompt to replay or move the slider [cite:3].
- Takeaway: a plain-language closing line linking the gameplay experience to the product’s idea [cite:3].

The summary and takeaway may be combined into a single end state so long as the result, replay prompt, and lesson remain easy to scan.

## Summary curve and history

The clarified decision is that the history plot should support both the current session and all stored runs. The interface should therefore offer a lightweight way to view span history from the present session and the cumulative local history.

The default summary view should prioritize the current session because it creates the clearest immediate “aha” moment. A secondary toggle or compact switch may reveal all locally stored runs for users who replay over time.

### History requirements

| View | Requirement |
|---|---|
| Session history | Show runs completed during the current visit |
| All-history view | Show all locally stored runs across visits |
| Persistence | Store cumulative run history locally only [cite:3] |
| Visualization | Use a small hand-rolled SVG line or dot-line chart rather than a charting library [cite:3] |

The chart should remain visually simple. The point is not statistical analysis but letting players see their own pattern emerge as delivery moves toward bit by bit [cite:3].

## Functional requirements

### Sequence generation

The app must generate a sequence of length \(N\) using a pure function, with each item represented as a shape-color token. Adjacent repeated tokens should be avoided to reduce perceptual ambiguity and keep the sequence feeling intentionally constructed, consistent with the original adjacent-repeat rule [cite:3].

### Presentation scheduling

Presentation scheduling must remain isolated to a single pure function because this is the only place the slider is allowed to influence the game [cite:3]. That function should accept the generated sequence and a delivery mode value and return a normalized timing and chunking schedule [cite:3].

### Recall checking

Recall validation must compare the submitted token sequence to the generated token sequence and return a strict boolean pass/fail result [cite:3]. No partial credit, fuzzy matching, or per-item tolerance should exist in v1.

### Run history persistence

The app must record completed runs as `{ deliveryMode, span, timestamp, sessionId }` so the player can inspect both current-session and cumulative local history. No data may leave the device [cite:3].

## State model

The source document proposes a minimal store structure with phase, round, sequence, input, deliveryMode, bestSpan, and history [cite:3]. That structure should be retained and extended slightly for the clarified sequence and history rules.

| State field | Type | Purpose |
|---|---|---|
| `phase` | enum | Current UI state: intro, present, recall, result, summary [cite:3] |
| `round` | number | Current target sequence length \(N\) [cite:3] |
| `sequence` | token[] | Generated shape-color token sequence for the active round |
| `input` | token[] | Player-entered response for the active round |
| `deliveryMode` | number | Slider value from 0 to 1 [cite:3] |
| `bestSpan` | number | Highest correctly completed round in the current run [cite:3] |
| `history` | object[] | Completed runs with slider value, span, timestamp, and session marker |
| `tokenTheme` | object | Current active shape/color set for the current progression cycle |
| `sessionId` | string | Identifier for grouping runs from the current visit |

A lightweight client state solution such as Zustand or useReducer remains sufficient and aligned with the source spec [cite:3].

## UX and visual design

The visual language should remain restrained, spacious, calm, and touch-first, as described in the source outline [cite:3]. The interface should use one accent color, generous whitespace, large typography, and minimal chrome so the task itself remains central [cite:3].

Because the sequence is shape-and-color based, the visual system must ensure tokens are highly distinguishable without relying on color alone. Shape silhouettes should remain easy to discriminate, and any color coding should be supported by enough contrast, labeling, or structural distinction to preserve accessibility [cite:3].

Words on screen should remain plain. Terms such as “all at once,” “bit by bit,” and “your span” are suitable, while research-heavy terminology should stay out of the main interaction [cite:3].

## Motion and sound

Motion should support clarity only: token reveals, slider feedback, and soft phase transitions are appropriate [cite:3]. Decorative motion that competes with the memory task should be avoided [cite:3].

Sound should be included only as an opt-in enhancement, matching the clarified decision. Audio must therefore be off by default and framed as optional ambient or feedback support rather than a core mechanic. If included, it should use soft nonverbal cues for transitions or result feedback, consistent with the source recommendation that sound be optional [cite:3].

## Accessibility

Accessibility remains a hard requirement. The app must be fully keyboard playable, preserve visible focus states, avoid essential feedback that relies on color alone, and respect reduced-motion preferences [cite:3].

Because tokens are based on color and shape, v1 must ensure that shape alone is sufficient for recognition. Color should enhance salience but must never be the sole distinguishing property for correct input.

Touch targets must be large enough for mobile interaction, and contrast must remain strong for all text and controls [cite:3]. The player should be able to complete a full run without a mouse.

## Privacy and storage

The product must remain local only, with no accounts, backend, or tracking [cite:3]. Run history should be stored locally so that both current-session and cumulative history views are possible, and the interface should state plainly that no data leaves the device [cite:3].

A clear-history action may be included in the summary area if it can be done without visual clutter. If present, it should clear only local stored history.

## Technical architecture

The preferred stack from the source document remains the right fit: Vite, React, TypeScript, Tailwind CSS, Framer Motion, and either Zustand or useReducer [cite:3]. The app should remain a single static page with no server dependency and no heavy charting library, using a hand-rolled SVG for the history curve [cite:3].

The suggested component structure from the source spec remains appropriate: `App`, `GameProvider`, `Slider`, `SequenceStage`, `RecallInput`, `RoundResult`, `RunSummary`, and `Takeaway` [cite:3]. The sequence stage and recall components should now support shape-color token rendering and dual input modes.

## Performance requirements

The application should load nearly instantly on a standard mobile connection because it is a one-screen static experience [cite:3]. Asset weight should stay low by using simple vector token rendering, lightweight motion, and no unnecessary third-party packages [cite:3].

Replay after changing the slider should be immediate, with no page reload and no noticeable transition lag. Layout shift between states should be minimized.

## Acceptance criteria

The product is complete when the following conditions are met:

- A first-time player can start without instructions and reach a first-run result in roughly 30 seconds [cite:3].
- A single incorrect answer ends the run immediately, and replay feels natural rather than punitive.
- Shape-color token sequences remain understandable on both phone and desktop.
- Both tap input and keyboard input are functional and accessible.
- Replaying at a more segmented delivery setting produces a visibly higher span often enough for the intended pattern to be legible [cite:3].
- The summary area can show both current-session history and cumulative local history.
- Optional sound is available only as a non-default enhancement.
- The app communicates the final lesson in one plain-language sentence a non-specialist can understand [cite:3].
- The product ships as a static single-page application with no backend or account system [cite:3].

## Finalized product decisions

The following missing decisions are now resolved for the v1 spec:

| Decision area | Final v1 direction |
|---|---|
| Sequence type | Shape-color token sequences, with random variation over turns |
| Token variation rule | Shape and/or color may stay the same through failed attempts; after a correct answer, shape, color, or both may change |
| Input mode | Both tap entry and typed entry |
| Error handling | A single mistake ends the run immediately |
| Difficulty curve | Recommended v1 rule is +1 item per success |
| Summary curve | Support both current session and all local stored runs |
| Sound | Opt-in enhancement, off by default |

## Release scope

The release unit is one deployable static web application suitable for Vercel, Netlify, or GitHub Pages, consistent with the original deployment guidance [cite:3]. No additional pages, account flows, or infrastructure are required for launch [cite:3].

The complete product should feel like a distilled demonstration rather than a feature-rich app. That discipline remains the central design standard of the project [file:1][cite:3].
