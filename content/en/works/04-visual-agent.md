---
title: "Visual Agent"
slug: "visual-agent"
company: "Doku · Visual regression tooling"
period: "2026 · MVP"
role: "System design & end-to-end development"
category: "AI & developer tools"
headline: "From product knowledge to reviewable iOS visual regression"
summary: "A visual testing system for Doku: turn product documents into reviewed, versioned knowledge, run cases on an iOS simulator, and retain verdicts, screenshots and recordings."
tags: ["Python", "FastAPI", "SQLite", "Appium / XCUITest", "MCP"]
focus: ["Knowledge production & versioning", "iOS device execution", "Visual verification & evidence"]
highlights: [{"value": "69", "label": "Versioned stable cases"}, {"value": "32", "label": "Connected to iOS execution"}, {"value": "23", "label": "Reviewed screen variants"}]
visual: {"title": "Visual Agent", "nodes": ["Knowledge", "Execution", "Evidence"]}
---

## My work

I designed and built Visual Agent end to end: the knowledge model, document preparation and review, retrieval and compilation, immutable releases, task orchestration, iOS worker, visual checks, web console, CLI / MCP and reporting.

Doku is the first application context. It combines short-drama viewing, content interaction and AI-assisted story creation. Continuous playback, dynamic feeds and asynchronous generation make regression testing depend on both device actions and explicit product expectations.

## From documents to reviewed knowledge

Concepts, rules, screens, targets, assertions, fixtures and cases become linked knowledge nodes. Inputs come from a specified Git commit or uploaded documents normalized into line-numbered text. External agents or Qwen propose candidates with source references, confidence, conflicts and open questions. Human review precedes compilation.

Retrieval combines IDs, aliases, SQLite FTS5, Chinese bigram fallback and module / platform filters. There are no embeddings in the current implementation. The first priority is inspectable provenance and precise dependency resolution.

## Immutable releases

Compilation snapshots knowledge, images, cases and scenarios. Content hashes determine release identity; manifests, database hashes and bundles preserve what was published. Staging directories, a compilation lock and atomic replacement control publication.

Tasks bind explicitly to a release and freeze module definitions, cases and execution scenarios. Missing releases, changed content and unresolved strong dependencies are rejected rather than falling back to the editable workspace. This fixes the test basis; accounts, networks and content data still need separate environment controls.

## Device execution and evidence

DeviceDriver isolates the platform implementation. Appium XCUITest / WDA supplies screenshots and touch actions; simctl handles the app lifecycle and MP4 recording. The system uses an external app artifact or an installed app without reading Doku business source code.

Thirty-two playback cases are connected to execution: 31 declarative visual scenarios and a dedicated visual-toggle executor for likes. Each case records preparation, actions, verification, cleanup and artifacts. Tasks aggregate verdicts, reasons and measurements.

## A verdict must match what its evidence proves

Local checks detect black screens, regional changes, motion and like-state colors. The like flow waits for a stable target, normalizes the initial state, performs the action, checks consecutive frames and attempts to restore the reversible state.

PASSED, FAILED, INCONCLUSIVE, INFRA_ERROR and NOT_RUN describe different outcomes. A red heart supports a visual activation assertion; it does not by itself prove server counts or persistence across pages. Insufficient evidence remains inconclusive.

## Recorded scope

The capability baseline is 2026-08-19: 69 stable cases, 207 knowledge nodes, 454 relationships, 23 reviewed screen variants and 53 targets. Of the 69 cases, 32 are executable, 33 are planned and four are blocked.

A historical run on 2026-08-11 used iPhone 16 Pro Simulator / iOS 18.2 with Doku 1.2.0+2026080402. All 32 selected cases ran: 18 passed, one failed and 13 were inconclusive. The run took about 5 minutes 10 seconds and saved 32 recordings, with zero infrastructure errors and zero execution-stage model calls.

That run predates the latest knowledge baseline and is not archived in the current database. These records do not establish a current-version regression result, total business coverage or labor savings. The recorded 58 Python tests and Ruff check belong to the 2026-08-19 baseline; this portfolio update did not rerun Visual Agent tests.

## Next steps

Prioritize strong knowledge references, a fixture prepare / verify / cleanup lifecycle, contamination and fault detection, and repeatable runs against frozen releases. Then add an independent semantic verifier for demonstrated gaps, followed by creator scenarios and an Android worker.

Qwen currently generates knowledge candidates. Autonomous planning, model grounding on unknown screens, runtime vision-model verification, a unified fixture runtime and Android execution remain unfinished.
