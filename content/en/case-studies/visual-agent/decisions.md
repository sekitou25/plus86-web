---
title: "Five engineering decisions"
lead: "The core work is trustworthy knowledge, traceable execution and verdicts that match their evidence."
---

## Make expectations reviewable

### Problem

Playback and creator rules are scattered across requirements, defects and walkthrough notes. UI actions alone do not define correctness.

### Implementation

Model concepts, rules, screens, targets, assertions, fixtures and cases. Candidates carry provenance, conflicts and open questions, then pass human review before compilation.

### Tradeoff

Schema and reference checks cannot establish factual accuracy. Models propose candidates; review determines the formal test basis.

## Pin the basis of every task

### Problem

Rules, coordinates and scenarios evolve. A historical failure must remain explainable when the workspace changes.

### Implementation

Content-addressed immutable releases preserve hashes and manifests. Tasks freeze their release, case dependencies and execution scenarios.

### Tradeoff

A knowledge snapshot is not an environment snapshot. Accounts, networks and data still need a unified fixture lifecycle.

## Separate the test kernel from app source

### Problem

Cross-platform and mixed UI create maintenance costs around element trees, instrumentation and business-source dependencies.

### Implementation

Use external app artifacts, DeviceDriver, normalized coordinates and a project atlas to operate iOS and record each case.

### Tradeoff

Normalized coordinates reduce resolution coupling, but do not solve layout changes, target drift or unknown screens.

## Close the like-state loop

### Problem

Missing targets, an already-active initial state and transition frames can all make a single click misleading.

### Implementation

Wait for a stable target, normalize state, click, verify color across consecutive frames, then attempt restoration while saving measurements.

### Tradeoff

Thresholds apply to the specified region and visual style. Visual activation alone cannot establish server state or persistence.

## Make inconclusive a first-class outcome

### Problem

A changed image can still show the wrong content. Treating an emitted action as business success creates false passes.

### Implementation

Separate action and verification responsibilities. Preserve reasons and artifacts, with five verdicts distinguishing product failure, insufficient evidence, infrastructure failure and no execution.

### Tradeoff

Complex semantics need an independent verifier; server effects require logs or query evidence. Current local rules stay within what their observations can prove.
