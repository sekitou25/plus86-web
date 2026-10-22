---
title: "Recording scenes"
---

## playback | Playback and lyrics

### Caption

Artwork, lyrics, progress, and playback state.

### Alt text

Qishui playback screen with artwork, lyrics, and a progress bar

### Observation label

State synchronization

### Observation

Lyrics, progress, and controls need a consistent playback state, including after a track change.

## navigation | Page navigation

### Caption

Open playback from a playlist, then return to other pages.

### Alt text

Recording of navigation between Qishui playlists and playback

### Observation label

Playback session

### Observation

Page navigation should not recreate or interrupt the active playback session. Playback state needs to be managed separately from page lifecycles.

## interaction | Comments and playback

### Caption

Open comments, return to playback, and change content.

### Alt text

Recording of interactions between Qishui playback and the comments panel

### Observation label

Interaction state

### Observation

Opening comments needs to preserve the current track and progress so that the matching state is shown on return.
