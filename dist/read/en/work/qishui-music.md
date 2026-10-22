# Qishui Music Player

Language: en
Body language: en

[Interactive edition](/?lang=en#/work/qishui-music) · [HTML](/read/en/work/qishui-music.html)

Player, home-screen components, and playback performance

Worked on Qishui's early client, covering the home player, lyrics, feed, caching, and initial App Store releases.

## Metadata

- **Company**: ByteDance

- **My role**: iOS Engineer

- **Project period**: 2021.10 — 2023.06

- **Technology & focus**: Swift / MVVM / OpenCombine / Audio & video

- **Category**: Music & playback

- Player & home feed

- Playback performance

- Caching & components

Qishui Music

- Preload

- Playback

- Cache

## Project overview

- **Home-screen playback**: Audio/video

- **Home-screen components**: MVVM

- **Initial releases**: App Store

## Player and home-screen engineering

I worked on Qishui Music's home player and client architecture, covering audio, short video, the infinite feed, and lyrics. My main responsibilities were playback tuning, home-screen components, caching, and early App Store releases.

2021.10–2023.06: early client development, home player, components, caching, and releases.

## Recordings and screenshots

Player, lyrics, and home feed

Product recordings / Current version

Silent recordings show the product in 2026. My scope covers player and home-screen work during 2021.10–2023.06, not every feature shown.

These are the existing scene descriptions, not frame-by-frame video transcripts. Other visual details still require viewing the original media.

### Playback and lyrics

Artwork, lyrics, progress, and playback state.

Qishui playback screen with artwork, lyrics, and a progress bar

#### State synchronization

Lyrics, progress, and controls need a consistent playback state, including after a track change.

[PRODUCT RECORDING](/assets/content/works/qishui/lyrics.mp4)

[Image description](/assets/content/works/qishui/lyrics-poster.jpg)

### Page navigation

Open playback from a playlist, then return to other pages.

Recording of navigation between Qishui playlists and playback

#### Playback session

Page navigation should not recreate or interrupt the active playback session. Playback state needs to be managed separately from page lifecycles.

[PRODUCT RECORDING](/assets/content/works/qishui/player.mp4)

[Image description](/assets/content/works/qishui/player-poster.jpg)

### Comments and playback

Open comments, return to playback, and change content.

Recording of interactions between Qishui playback and the comments panel

#### Interaction state

Opening comments needs to preserve the current track and progress so that the matching state is shown on return.

[PRODUCT RECORDING](/assets/content/works/qishui/discovery.mp4)

[Image description](/assets/content/works/qishui/discovery-poster.jpg)

## Player responsibilities

Home-screen presentation, state coordination, and playback infrastructure. Select a node for details.

Responsibility map for Qishui's home screen, state components, and playback infrastructure

Based on my work at the time. Connections show collaboration, not a complete production architecture.

### Home-screen presentation

#### Infinite feed / Song cells

Worked on the infinite home feed and configurable song cells reused across product scenarios.

#### krc / lrc lyrics

Implemented krc and lrc support and coordinated lyrics with playback progress and UI state.

#### Audio / Short video

Worked on home-screen audio and short-video playback, including presentation and playback state.

### State and components

#### MVVM

Used MVVM to separate presentation from business state and support component composition and reuse.

#### OpenCombine-style messaging

Used OpenCombine-style messaging for component events and playback-state updates.

### Playback and data

#### VOD SDK / Playback tuning

Built the product player on the in-house VOD SDK. Tuned first-frame latency and stability through preloading, pre-rendering, adaptive bitrate, and buffer thresholds.

#### Audio / Application caching

Separated audio caching and consolidated application caching. Built a YYCache component, changed startup reads, and migrated Core Data to key-value storage.

#### Instrumentation / Alerts / On-call

Organized playback instrumentation, alerts, and on-call work for detecting and investigating production issues.

## Playback performance, components, and caching

Three areas of home-player work, with their resource and maintenance costs.

### First frame and playback stability

- **Problem**: Track changes require resource preparation, decoding, and buffering. First-frame latency, stalls, and failures need separate measurement and investigation.

- **Implementation**: Used preloading and pre-rendering on the in-house VOD SDK, and tuned adaptive bitrate and buffer thresholds. Organized instrumentation, alerts, and an on-call process.

- **Tradeoffs**: Preloading uses bandwidth and memory. Its benefit needs to be assessed against first-frame latency, stalls, and failures—not a single fast playback attempt.

### Home-screen components

- **Problem**: The home screen supports audio, short video, an infinite feed, and different lyric formats. Product changes need reusable playback and presentation components.

- **Implementation**: Organized the home screen with MVVM and OpenCombine-style messaging. Built configurable song cells for reuse across product scenarios.

- **Tradeoffs**: Configuration needs limits. Shared playback state and scenario-specific behavior need separate responsibilities rather than accumulating in one page.

### Caching and startup reads

- **Problem**: Audio files and application data have different access patterns. Database reads can also occupy the startup critical path.

- **Implementation**: Separated audio and application caching, made startup reads asynchronous or deferred, migrated Core Data to key-value storage, and built a YYCache-based component.

- **Tradeoffs**: Cache boundaries affect read cost, storage, and maintenance. Migration and startup changes also need compatibility and diagnostic support.

## Preloading in a track-change flow

Illustrative demo

Choose whether resources are preloaded, then run the track change.

A local flow illustration with no connection to a real player. Steps and animation duration do not represent production behavior or performance.

### Scenarios

- Not preloaded

- Preloaded

### 1. Track-change event

- **Default scenario**: The UI requests a track change and begins preparing the next track.

- **Comparison scenario**: The UI requests a track change and reads preloaded resources.

### 2. Resource preparation

- **Default scenario**: Request and prepare resources after the action.

- **Comparison scenario**: Reuse resources prepared before the action.

### 3. Decoding and buffering

- **Default scenario**: The VOD SDK decodes and buffers until resources are playable.

- **Comparison scenario**: Use prepared resources, while still handling network and buffer changes.

### 4. State synchronization

- **Default scenario**: Update the track, lyrics, progress, and playback controls.

- **Comparison scenario**: Update the track, lyrics, progress, and playback controls.

### States and outputs

- **start**: Play the next track

- **running**: Changing track…

- **resume**: Continue

- **idle**: Choose a preparation state, then change the track.

- **complete**: Playback has started. Lyrics and progress are synchronized.

- **stalled**: Waiting for resources.

- **sample**: PLAYBACK / DEMO

- **output**: Waiting to play

- **outputRunning**: Preparing resources

- **outputComplete**: Playing

## Project notes

## My role

During Qishui Music's early development, I owned business iteration and engineering architecture for its home player. The scope included audio and short-video playback, an infinite feed, home-screen UI, krc / lrc lyrics, and the initial store-release process.

## Playback performance and monitoring

Built and maintained the product player on the company's video-on-demand SDK. Used preloading and pre-rendering to improve first-frame latency, and tuned adaptive bitrate switching and buffering thresholds to address stalls and playback failures.

Organized playback metrics and instrumentation, established alerts for core indicators, and built an on-call process to detect and investigate production issues.

## Components and caching

Used MVVM and OpenCombine-style message passing to make home-screen capabilities component based. Turned song cells into configurable, reusable UI components for different product scenarios.

Separated audio-file caching from business caching, moved database reads off the critical startup path, and migrated data from Core Data to key-value storage. Built a YYCache-based business-cache component and extended it to other product areas.

## Releases

Owned the early App Store release workflow: certificates, project configuration, test and store builds, and review submissions. Introduced a certificate pool to simplify developer signing and improve the team's development experience.
