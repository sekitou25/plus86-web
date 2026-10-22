---
kicker: "PLAYER / RESPONSIBILITIES"
title: "Player responsibilities"
lead: "Home-screen presentation, state coordination, and playback infrastructure. Select a node for details."
selectionLabel: "Responsibilities and implementation"
defaultNode: "view-model"
diagramLabel: "Responsibility map for Qishui's home screen, state components, and playback infrastructure"
note: "Based on my work at the time. Connections show collaboration, not a complete production architecture."
---

## experience | Home-screen presentation

### feed | Infinite feed / Song cells

Worked on the infinite home feed and configurable song cells reused across product scenarios.

### lyrics | krc / lrc lyrics

Implemented krc and lrc support and coordinated lyrics with playback progress and UI state.

### media | Audio / Short video

Worked on home-screen audio and short-video playback, including presentation and playback state.

## coordination | State and components

### view-model | MVVM

Used MVVM to separate presentation from business state and support component composition and reuse.

### events | OpenCombine-style messaging

Used OpenCombine-style messaging for component events and playback-state updates.

## foundation | Playback and data

### player-sdk | VOD SDK / Playback tuning

Built the product player on the in-house VOD SDK. Tuned first-frame latency and stability through preloading, pre-rendering, adaptive bitrate, and buffer thresholds.

### cache | Audio / Application caching

Separated audio caching and consolidated application caching. Built a YYCache component, changed startup reads, and migrated Core Data to key-value storage.

### telemetry | Instrumentation / Alerts / On-call

Organized playback instrumentation, alerts, and on-call work for detecting and investigating production issues.
