---
kicker: "SYSTEM DESIGN / TWO CONNECTED LOOPS"
title: "Knowledge defines expectations. Devices produce evidence."
lead: "From source documents to a knowledge release, then to execution bound to that release. Select a node to inspect its responsibility."
selectionLabel: "MODULE & IMPLEMENTATION"
defaultNode: "release"
diagramLabel: "Visual Agent document preparation, knowledge release, device execution and evidence verification pipeline"
note: "Based on the implemented flow documented in the report. Runtime models, autonomous planning, an Android worker and a unified fixture runtime remain unfinished."
---

## preparation | Prepare sources

### sources | Git / documents

Pin a source commit or normalize uploaded documents into line-numbered text, preserving traceable inputs.

### candidates | Candidates & review

External agents or Qwen submit structured candidates with source references. Reviewers accept, edit, merge, reject or defer them.

## knowledge | Publish knowledge

### compile | Rules & retrieval

Explicit references connect rules, screens, targets, assertions and cases. Pydantic validates structure; aliases and SQLite FTS5 support retrieval.

### release | Immutable releases

Compilation freezes knowledge, cases and scenarios. Content hashes identify releases; manifests and integrity checks keep the task’s basis consistent.

## execution | Run device tasks

### task | Release-bound snapshots

Task creation selects cases and records the release, per-case dependencies and scenarios before asynchronous sequential execution.

### driver | iOS worker

DeviceDriver isolates device capabilities. Appium XCUITest / WDA provides actions and screenshots; simctl manages apps and recordings.

## verification | Verify independently

### verdict | Rules & verdicts

Reobserve black screens, regional changes, motion or stable colors. Keep passed, failed, inconclusive, infrastructure error and not-run outcomes separate.

### artifacts | Reports & evidence

Store per-case actions, reasons, measurements, screenshots and recordings. Web, CLI and MCP expose task status and results.
