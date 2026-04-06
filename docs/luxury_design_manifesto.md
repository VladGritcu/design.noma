# NOMA Studio - Luxury Design Manifesto (Gold Standard)

This document defines the high-end architectural and editorial standards for the NOMA Studio digital experience. All future components, animations, and layouts must adhere to these tokens to maintain a "buttery smooth," premium performance.

## 1. Typography (The "Editorial" Look)
Our typography is designed after high-end architectural publications (Bertani style), prioritizing white space and letter-spacing for an "expensive" feel.

- **Primary Heading (Serif):** `Cormorant Garamond`
    - Use for large titles and primary navigation links.
    - **Weights:** 300 (Light), 400 (Regular).
    - **Letter-spacing:** `0.05em` to `0.2em` for navigation.
- **Secondary / Utility (Sans-Serif):** `Jost`
    - Use for labels, buttons, sub-labels, and body text.
    - **Weights:** 300 (Light), 400 (Regular), 500 (Medium).
    - **Letter-spacing:** `0.1em` to `0.4em` for sub-labels.

## 2. Motion (The "Cinematic" Feel)
Motion at NOMA must feel non-linear, controlled, and fluid. Never use basic `ease` or `linear` transitions.

- **Premium Reveal:** `cubic-bezier(0.16, 1, 0.3, 1)` (Quart Out). 
    - Use for menu opens, page reveals, and card appearances.
- **Micro-Interaction:** `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Performance Constraints (Mobile Safari):**
    - **Avoid continuous filters:** Do not use `filter: blur()` or `backdrop-filter` inside @keyframes or transitions that run on the main thread.
    - **GPU Acceleration:** Only animate `opacity` and `transform`.
    - **Staggering:** Keep stagger delays between `0.05s` and `0.1s` for the best rhythmic feel.

## 3. UI Tokens & Spacing
- **Separators:** Use thin (`1px`), subtle gradients (`rgba(255, 232, 191, 0.4)` to transparent).
- **Centering:** Prioritize symmetrical, centered layouts for navigation and core messaging.
- **Padding:** Use responsive `clamp()` functions to ensure fixed aspects remain elegant across devices.

## 4. Performance Checklist (iOS Safari)
Before shipping any animation, verify:
- [ ] No `visibility: hidden` transitions on WebKit (use `opacity` instead).
- [ ] No layout-triggering properties (`width`, `height`, `left`, `top`, `margin`) during animations.
- [ ] Body scroll locking uses `overflow: hidden` + `touch-action: none` instead of `position: fixed`.
