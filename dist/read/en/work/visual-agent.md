# Visual Agent

Language: en
Body language: en

[Interactive edition](/?lang=en#/work/visual-agent) · [HTML](/read/en/work/visual-agent.html)

From product knowledge to reviewable iOS visual regression

A visual testing system for Doku: turn product documents into reviewed, versioned knowledge, run cases on an iOS simulator, and retain verdicts, screenshots and recordings.

## Metadata

- **Company**: Doku · Visual regression tooling

- **My role**: System design & end-to-end development

- **Project period**: 2026 · MVP

- **Technology & focus**: Python / FastAPI / SQLite / Appium / XCUITest / MCP

- **Category**: AI & developer tools

- Knowledge production & versioning

- iOS device execution

- Visual verification & evidence

Visual Agent

- Knowledge

- Execution

- Evidence

## Project overview

- **Versioned stable cases**: 69

- **Connected to iOS execution**: 32

- **Reviewed screen variants**: 23

## Every regression, backed by evidence.

I designed and built Visual Agent end to end: turn scattered product documents into reviewed, versioned knowledge, run tests on an iOS simulator, and retain the reasoning and evidence behind each verdict. Doku, a short-drama and AI-assisted storytelling app, is its first application context.

Capability baseline: 2026-08-19. Stable does not mean executed: 32 playback cases are connected to iOS execution; the other 37 are planned or blocked.

## Recordings and screenshots

Visual Agent · Knowledge-driven regression

Doku application context / iOS MVP

These actual Doku iOS screenshots come from the report’s 2026-07-30 screen catalog and illustrate the application under test. They are not the Visual Agent console or a claim about the current live app. Capabilities and historical figures come from the Doku × Visual Agent report compiled on 2026-10-26. No device regression was rerun for this portfolio update.

These are the existing scene descriptions, not frame-by-frame video transcripts. Other visual details still require viewing the original media.

### Continuous playback

For You playback, episode navigation and interactions provide the context for the first regression scenarios.

Doku For You screen with video, episode navigation and interaction targets

#### CONTINUOUS STATE

Black screens, episode changes and interaction responses require observations over time, beyond a single screenshot.

[PRODUCT SCREENSHOT](/assets/content/works/visual-agent/doku-feed.webp)

### Creator entry

An empty conversation, suggestions, draft prompt and input field.

Doku AI story creator with introductory messages, suggestions and an input field

#### PRODUCT RULES

Creator rules and cases are versioned, but the full creator-module device execution flow is not yet implemented.

[PRODUCT SCREENSHOT](/assets/content/works/visual-agent/doku-creator.webp)

### Story preview

Story text, the publish action and revision suggestions form the next product state.

Doku story preview with story text, publish action and revision suggestions

#### STATE TIMING

Rules must describe which actions are available during and after generation, including constraints around publishing.

[PRODUCT SCREENSHOT](/assets/content/works/visual-agent/doku-preview.webp)

## Knowledge defines expectations. Devices produce evidence.

From source documents to a knowledge release, then to execution bound to that release. Select a node to inspect its responsibility.

Visual Agent document preparation, knowledge release, device execution and evidence verification pipeline

Based on the implemented flow documented in the report. Runtime models, autonomous planning, an Android worker and a unified fixture runtime remain unfinished.

### Prepare sources

#### Git / documents

Pin a source commit or normalize uploaded documents into line-numbered text, preserving traceable inputs.

#### Candidates & review

External agents or Qwen submit structured candidates with source references. Reviewers accept, edit, merge, reject or defer them.

### Publish knowledge

#### Rules & retrieval

Explicit references connect rules, screens, targets, assertions and cases. Pydantic validates structure; aliases and SQLite FTS5 support retrieval.

#### Immutable releases

Compilation freezes knowledge, cases and scenarios. Content hashes identify releases; manifests and integrity checks keep the task’s basis consistent.

### Run device tasks

#### Release-bound snapshots

Task creation selects cases and records the release, per-case dependencies and scenarios before asynchronous sequential execution.

#### iOS worker

DeviceDriver isolates device capabilities. Appium XCUITest / WDA provides actions and screenshots; simctl manages apps and recordings.

### Verify independently

#### Rules & verdicts

Reobserve black screens, regional changes, motion or stable colors. Keep passed, failed, inconclusive, infrastructure error and not-run outcomes separate.

#### Reports & evidence

Store per-case actions, reasons, measurements, screenshots and recordings. Web, CLI and MCP expose task status and results.

## One recorded run. Three distinct outcomes.

All 32 selected playback cases ran. Select an outcome to inspect what the evidence supports.

ENVIRONMENT

2026-08-11 / iPhone 16 Pro Simulator / iOS 18.2 / Doku 1.2.0+2026080402

- **Cases executed**: 32

- **Recordings**: 32

- **Approx. duration**: 5:10

- **Infrastructure errors**: 0

- **Runtime model calls**: 0

### Passed / 18

Evidence supported the local visual assertions for 18 cases; that does not establish correctness of the entire business flow.

### Failed / 1

One follow-button case produced insufficient visual response after the click and was retained as a failure for review.

### Inconclusive / 13

Thirteen cases needed semantic evidence about identity, exact state, layout or boundary data. Local visual changes were insufficient for a definitive verdict.

This historical run predates the 2026-08-19 knowledge baseline and is not archived in the current database. The 69 stable cases have not had a corresponding new full regression. These figures do not establish current total coverage or labor savings.

## Five engineering decisions

The core work is trustworthy knowledge, traceable execution and verdicts that match their evidence.

### Make expectations reviewable

- **Problem**: Playback and creator rules are scattered across requirements, defects and walkthrough notes. UI actions alone do not define correctness.

- **Implementation**: Model concepts, rules, screens, targets, assertions, fixtures and cases. Candidates carry provenance, conflicts and open questions, then pass human review before compilation.

- **Tradeoffs**: Schema and reference checks cannot establish factual accuracy. Models propose candidates; review determines the formal test basis.

### Pin the basis of every task

- **Problem**: Rules, coordinates and scenarios evolve. A historical failure must remain explainable when the workspace changes.

- **Implementation**: Content-addressed immutable releases preserve hashes and manifests. Tasks freeze their release, case dependencies and execution scenarios.

- **Tradeoffs**: A knowledge snapshot is not an environment snapshot. Accounts, networks and data still need a unified fixture lifecycle.

### Separate the test kernel from app source

- **Problem**: Cross-platform and mixed UI create maintenance costs around element trees, instrumentation and business-source dependencies.

- **Implementation**: Use external app artifacts, DeviceDriver, normalized coordinates and a project atlas to operate iOS and record each case.

- **Tradeoffs**: Normalized coordinates reduce resolution coupling, but do not solve layout changes, target drift or unknown screens.

### Close the like-state loop

- **Problem**: Missing targets, an already-active initial state and transition frames can all make a single click misleading.

- **Implementation**: Wait for a stable target, normalize state, click, verify color across consecutive frames, then attempt restoration while saving measurements.

- **Tradeoffs**: Thresholds apply to the specified region and visual style. Visual activation alone cannot establish server state or persistence.

### Make inconclusive a first-class outcome

- **Problem**: A changed image can still show the wrong content. Treating an emitted action as business success creates false passes.

- **Implementation**: Separate action and verification responsibilities. Preserve reasons and artifacts, with five verdicts distinguishing product failure, insufficient evidence, infrastructure failure and no execution.

- **Tradeoffs**: Complex semantics need an independent verifier; server effects require logs or query evidence. Current local rules stay within what their observations can prove.

## The same image can support different conclusions.

Illustrative demo

Both assertions observe a red heart. Compare why visual activation can pass while persistence remains inconclusive.

A local explanatory example with no Doku, device or model connection. It produces no real regression results. The persistence assertion illustrates an evidence boundary, not an implemented persistence verifier.

### Scenarios

- Visual activation

- Persistence assertion

### 1. Pin the basis

- **Default scenario**: Bind a knowledge release and a visual activation assertion.

- **Comparison scenario**: Use the same release, but assert that the state persists.

### 2. Normalize state

- **Default scenario**: Confirm the target is visible and restore its inactive state.

- **Comparison scenario**: Use the same visible target and inactive initial state.

### 3. Act & observe

- **Default scenario**: Click once and retain before / after frames with a stable red state.

- **Comparison scenario**: Observe the same red heart; only visual evidence is available.

### 4. Verify independently

- **Default scenario**: Consecutive frames support the visual transition: PASSED.

- **Comparison scenario**: Cross-page or server evidence is missing: INCONCLUSIVE.

### States and outputs

- **start**: Run verification example

- **running**: Running…

- **resume**: Continue

- **idle**: Choose an assertion, then run the example.

- **complete**: Example complete.

- **stalled**: Insufficient evidence.

- **sample**: BEFORE → AFTER / ILLUSTRATIVE

- **output**: Ready to run

- **outputRunning**: Collecting before, after and consecutive-frame evidence

- **outputComplete**: Verdict reasoning retained

- PASSED · Visual activation verified

- INCONCLUSIVE · Persistence evidence missing

- Consecutive frames support the transition from inactive to red. The visual assertion passes.

- The same red heart does not prove persistence across pages or on the server. Keep the visual evidence and require an independent query or log.

## Project notes

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
