---
slug: "qishui-music"
title: "Qishui Music Player"
company: "ByteDance"
period: "2021.10 — 2023.06"
role: "iOS Engineer"
category: "Music & playback"
headline: "Building a music experience, from zero to one."
summary: "Joined Qishui Music at its early stage, owning home-player development, engineering architecture, and the initial App Store release process."
tags: ["Swift", "MVVM", "OpenCombine", "Audio & video"]
focus: ["Player & home feed", "Playback performance", "Caching & components"]
highlights: [{"value": "0 → 1", "label": "Early-stage product development"}, {"value": "MVVM", "label": "Component-based home architecture"}, {"value": "End to end", "label": "Development through App Store release"}]
visual: {"caption": "Player engineering illustration", "label": "SOUND, IN MOTION", "title": "Qishui Music", "subtitle": "Player / Home", "nodes": ["Preload", "Playback", "Cache"], "footer": "The engineering behind a song."}
---

## My role

During Qishui Music's early development, I owned business iteration and engineering architecture for its home player. The scope included audio and short-video playback, an infinite feed, home-screen UI, krc / lrc lyrics, and the initial store-release process.

## Faster, more reliable playback

Built and maintained the product player on the company's video-on-demand SDK. Used preloading and pre-rendering to improve first-frame latency, and tuned adaptive bitrate switching and buffering thresholds to address stalls and playback failures.

Organized playback metrics and instrumentation, established alerts for core indicators, and built an on-call process to detect and investigate production issues.

## A home screen built for iteration

Used MVVM and OpenCombine-style message passing to make home-screen capabilities component based. Turned song cells into configurable, reusable UI components for different product scenarios.

Separated audio-file caching from business caching, moved database reads off the critical startup path, and migrated data from Core Data to key-value storage. Built a YYCache-based business-cache component and extended it to other product areas.

## Getting the product into users' hands

Owned the early App Store release workflow: certificates, project configuration, test and store builds, and review submissions. Introduced a certificate pool to simplify developer signing and improve the team's development experience.
