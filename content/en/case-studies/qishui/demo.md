---
title: "Preloading in a track-change flow"
lead: "Choose whether resources are preloaded, then run the track change."
modes: ["Not preloaded","Preloaded"]
start: "Play the next track"
running: "Changing track…"
resume: "Continue"
idle: "Choose a preparation state, then change the track."
complete: "Playback has started. Lyrics and progress are synchronized."
stalled: "Waiting for resources."
sample: "PLAYBACK / DEMO"
output: "Waiting to play"
outputRunning: "Preparing resources"
outputComplete: "Playing"
footnote: "A local flow illustration with no connection to a real player. Steps and animation duration do not represent production behavior or performance."
---

## Track-change event

### Default scenario

The UI requests a track change and begins preparing the next track.

### Comparison scenario

The UI requests a track change and reads preloaded resources.

## Resource preparation

### Default scenario

Request and prepare resources after the action.

### Comparison scenario

Reuse resources prepared before the action.

## Decoding and buffering

### Default scenario

The VOD SDK decodes and buffers until resources are playable.

### Comparison scenario

Use prepared resources, while still handling network and buffer changes.

## State synchronization

### Default scenario

Update the track, lyrics, progress, and playback controls.

### Comparison scenario

Update the track, lyrics, progress, and playback controls.
