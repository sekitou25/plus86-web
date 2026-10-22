---
title: "Layout and refresh behavior"
lead: "Content presentation in the feed and updates after a click."
---

## Waterfall layouts

### Experience goal

Images and title lengths vary. Layout needs to balance information density, readability, and scrolling.

### Engineering work

Contribute to the Top Stories client, including waterfall-feed presentation.

### Trade-off

Showing more content changes card sizes and hierarchy. Layout needs to account for content differences, not just the number of items on a screen.

## Click-triggered refresh

### Experience goal

People return to the feed after opening content. Updates need to account for the previous browsing position and continued reading.

### Engineering work

Added recommendation refresh behavior after content clicks.

### Trade-off

Refresh scope and timing depend on the product design. The demo contrasts an unchanged list with one card replacement; it does not reproduce production ranking or refresh rules.

## Cross-stack work

### Experience goal

Presentation, clicks, and updates span client implementations with different state and ownership boundaries.

### Engineering work

Work across Flutter, Swift, and C++ on related Official Accounts client features.

### Trade-off

The stack describes the scope of the work, not the implementation of each screen. This page covers responsibilities I can share without internal implementation details.
