# WeChat · Official Accounts

Language: en
Body language: en

[Interactive edition](/?lang=en#/work/wechat-official-accounts) · [HTML](/read/en/work/wechat-official-accounts.html)

Recommendation-feed layouts and click-triggered refresh

Contribute to the Official Accounts client, including waterfall layouts and click-triggered refresh in the Top Stories feed.

## Metadata

- **Company**: Tencent · WeChat

- **My role**: Client Engineer

- **Project period**: From 2025.04

- **Technology & focus**: Flutter / Swift / C++ / Recommendation feeds

- **Category**: Content & reading

- Official Accounts

- Top Stories feed

- Waterfall layouts & refresh

Official Accounts

- Content

- Recommend

- Read

## Project overview

- **Feed presentation**: Waterfall

- **Content update strategy**: Click refresh

- **Flutter / Swift / C++**: Client

## Official Accounts feeds: layouts and click refresh

I contribute to the WeChat Official Accounts client, primarily on waterfall layouts and click-triggered refresh in the Top Stories feed. The project stack includes Flutter, Swift, and C++.

Contribute to the Official Accounts client, including waterfall layouts and click-triggered refresh in Top Stories.

## Recordings and screenshots

Official Accounts feed and account page

Recording and stills / Current version

Silent recording of the product in 2026; screenshots come from the same video. My scope covers related client work, Top Stories, waterfall layouts, and click refresh—not every feature shown.

These are the existing scene descriptions, not frame-by-frame video transcripts. Other visual details still require viewing the original media.

### Browsing recording

Scroll through the Official Accounts feed, then open an account page.

Recording of scrolling the Official Accounts feed and opening an account page

#### Content layout

Two-column cards and horizontal articles share a screen, with different image proportions, title lengths, and information hierarchy.

[PRODUCT RECORDING](/assets/content/works/wechat/reading.mp4)

[Image description](/assets/content/works/wechat/reading-poster.jpg)

### Account page

Account introduction, categories, and articles. Captured from the recording.

Official Account page still with an introduction, categories, and article list

#### Page navigation

The recording shows navigation from the feed to an account page. The full account-page feature set is outside the personal scope described here.

[PRODUCT SCREENSHOT](/assets/content/works/wechat/reading-still-2.jpg)

### Feed still

Two-column image cards and horizontal articles.

Official Accounts feed still with two-column image cards and horizontal articles

#### Card variation

Content varies in size and detail. Layout rules need to balance how much fits on screen with the readability of each card.

[PRODUCT SCREENSHOT](/assets/content/works/wechat/reading-still-1.jpg)

## Feed responsibilities

Presentation, click refresh, and client collaboration. Select a node to see the scope.

Responsibility map for content presentation, interaction, and client collaboration in related Official Accounts work

Based on the project record. Shows responsibilities and collaboration, not WeChat's complete production architecture.

### Content presentation

#### Recommendation feed

Contribute to the Official Accounts client, primarily on the Top Stories feed.

#### Waterfall layouts

Support waterfall-feed presentation and the layout of different content in the list.

### Clicks and updates

#### Content click

A content click opens reading and relates to subsequent refresh behavior. Presentation and updates need consistent handling of the same action.

#### Click-triggered refresh

Added recommendation refresh behavior after clicks. Actual refresh scope, ranking, and timing depend on the product design.

### Client collaboration

#### Flutter

Part of the project stack used for related Official Accounts client iterations.

#### Swift / C++

The stack includes Swift and C++. Together with Flutter, these describe technical coverage, not the implementation ownership of each page.

## Layout and refresh behavior

Content presentation in the feed and updates after a click.

### Waterfall layouts

- **Problem**: Images and title lengths vary. Layout needs to balance information density, readability, and scrolling.

- **Implementation**: Contribute to the Top Stories client, including waterfall-feed presentation.

- **Tradeoffs**: Showing more content changes card sizes and hierarchy. Layout needs to account for content differences, not just the number of items on a screen.

### Click-triggered refresh

- **Problem**: People return to the feed after opening content. Updates need to account for the previous browsing position and continued reading.

- **Implementation**: Added recommendation refresh behavior after content clicks.

- **Tradeoffs**: Refresh scope and timing depend on the product design. The demo contrasts an unchanged list with one card replacement; it does not reproduce production ranking or refresh rules.

### Cross-stack work

- **Problem**: Presentation, clicks, and updates span client implementations with different state and ownership boundaries.

- **Implementation**: Work across Flutter, Swift, and C++ on related Official Accounts client features.

- **Tradeoffs**: The stack describes the scope of the work, not the implementation of each screen. This page covers responsibilities I can share without internal implementation details.

## Content updates after a click

Illustrative demo

Choose a card and a behavior, then simulate returning from reading.

A local illustration with no WeChat or recommendation-service connection. Refresh replaces only the selected card, not production rules. Content and animation are for demonstration.

### Scenarios

- Keep the original feed

- Illustrate click refresh

### 1. Content click

- **Default scenario**: Open the selected content.

- **Comparison scenario**: Open the selected content and record the selection.

### 2. Reading

- **Default scenario**: Read the opened content. The list stays unchanged.

- **Comparison scenario**: Read the opened content. Prepare the illustrative update.

### 3. Return to the list

- **Default scenario**: Return to the original list.

- **Comparison scenario**: Replace the selected demo card on return.

### 4. List state

- **Default scenario**: All cards remain unchanged.

- **Comparison scenario**: New content appears at the selected position. Other cards stay unchanged.

### States and outputs

- **start**: Simulate reading and return

- **running**: Running…

- **resume**: Continue

- **idle**: Choose a card and behavior, then run the demo.

- **complete**: Back in the list. Compare the cards.

- **stalled**: Waiting for the next step.

- **sample**: CONTENT FEED / ILLUSTRATION

- **output**: Ready to run

- **outputRunning**: Click → Read → Return

- **outputComplete**: Back in the list

- **feedLabel**: Choose a demo card

- **selectedLabel**: Selected

- **updatedLabel**: Updated

- **retainedLabel**: Original

### Illustrative cards

- A neighborhood bookshop / City notes

- Notes on a client refactor / Development

- A weekend hiking route / Travel

- Reading a backtest report / Research notes

### Illustrative replacement

A city walking map / New content

## Project notes

## My role

Contribute to the Official Accounts client, primarily on the Top Stories recommendation feed.

## Recommendation feed

- Support waterfall layouts for the Top Stories feed.

- Add click-triggered recommendation refresh.

- Work across Flutter, Swift, and C++ on client features.
