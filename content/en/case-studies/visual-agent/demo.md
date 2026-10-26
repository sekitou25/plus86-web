---
title: "The same image can support different conclusions."
lead: "Both assertions observe a red heart. Compare why visual activation can pass while persistence remains inconclusive."
modes: ["Visual activation", "Persistence assertion"]
start: "Run verification example"
running: "Running…"
resume: "Continue"
idle: "Choose an assertion, then run the example."
complete: "Example complete."
stalled: "Insufficient evidence."
sample: "BEFORE → AFTER / ILLUSTRATIVE"
output: "Ready to run"
outputRunning: "Collecting before, after and consecutive-frame evidence"
outputComplete: "Verdict reasoning retained"
verdicts: ["PASSED · Visual activation verified", "INCONCLUSIVE · Persistence evidence missing"]
completions: ["Consecutive frames support the transition from inactive to red. The visual assertion passes.", "The same red heart does not prove persistence across pages or on the server. Keep the visual evidence and require an independent query or log."]
footnote: "A local explanatory example with no Doku, device or model connection. It produces no real regression results. The persistence assertion illustrates an evidence boundary, not an implemented persistence verifier."
---

## Pin the basis

### Visual assertion

Bind a knowledge release and a visual activation assertion.

### Persistence assertion

Use the same release, but assert that the state persists.

## Normalize state

### Visual assertion

Confirm the target is visible and restore its inactive state.

### Persistence assertion

Use the same visible target and inactive initial state.

## Act & observe

### Visual assertion

Click once and retain before / after frames with a stable red state.

### Persistence assertion

Observe the same red heart; only visual evidence is available.

## Verify independently

### Visual assertion

Consecutive frames support the visual transition: PASSED.

### Persistence assertion

Cross-page or server evidence is missing: INCONCLUSIVE.
