---
title: "Playback performance, components, and caching"
lead: "Three areas of home-player work, with their resource and maintenance costs."
---

## First frame and playback stability

### Experience goal

Track changes require resource preparation, decoding, and buffering. First-frame latency, stalls, and failures need separate measurement and investigation.

### Engineering work

Used preloading and pre-rendering on the in-house VOD SDK, and tuned adaptive bitrate and buffer thresholds. Organized instrumentation, alerts, and an on-call process.

### Trade-off

Preloading uses bandwidth and memory. Its benefit needs to be assessed against first-frame latency, stalls, and failures—not a single fast playback attempt.

## Home-screen components

### Experience goal

The home screen supports audio, short video, an infinite feed, and different lyric formats. Product changes need reusable playback and presentation components.

### Engineering work

Organized the home screen with MVVM and OpenCombine-style messaging. Built configurable song cells for reuse across product scenarios.

### Trade-off

Configuration needs limits. Shared playback state and scenario-specific behavior need separate responsibilities rather than accumulating in one page.

## Caching and startup reads

### Experience goal

Audio files and application data have different access patterns. Database reads can also occupy the startup critical path.

### Engineering work

Separated audio and application caching, made startup reads asynchronous or deferred, migrated Core Data to key-value storage, and built a YYCache-based component.

### Trade-off

Cache boundaries affect read cost, storage, and maintenance. Migration and startup changes also need compatibility and diagnostic support.
