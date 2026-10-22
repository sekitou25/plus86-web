# Talkie / Xingye

Language: en
Body language: en

[Interactive edition](/?lang=en#/work/talkie-xingye) · [HTML](/read/en/work/talkie-xingye.html)

IM, streaming messages, and networking infrastructure

Owned core IM modules, message latency, list rendering, persistent connections, and networking infrastructure for Talkie and Xingye.

## Metadata

- **Company**: MiniMax

- **My role**: Senior iOS Engineer

- **Project period**: 2023.06 — 2025.03

- **Technology & focus**: Swift / IM / Persistent connections / DiffableDataSource

- **Category**: AI & conversation

- End-to-end messaging

- Streaming conversations

- Networking & stability

Talkie / Xingye

- Client

- Connection

- AI conversation

## Project overview

- **p90 conversation latency**: −610 ms

- **Message-list scrolling FPS**: 51 → 60

- **Conversation availability**: 99.9%

## Messaging and networking for AI conversations

I owned core IM modules, networking infrastructure, and stability work for Talkie / Xingye. This included reducing message latency, rebuilding the message list, and developing persistent connections, synchronization, and persistence in-house.

Metrics use the definitions from the 2023.06–2025.03 project period.

## Recordings and screenshots

IM, streaming messages, and networking

Recordings and screenshots / Current version

Recordings and screenshots show Xingye in 2026; recordings are silent. My scope covers IM, networking, and stability during 2023.06–2025.03, not every feature shown.

These are the existing scene descriptions, not frame-by-frame video transcripts. Other visual details still require viewing the original media.

### Conversation recording

Browse characters, send a message, and receive a reply.

Xingye recording of character browsing, message sending, and replies

#### Send state

The UI needs distinct waiting, sending, and reply states that match actual message processing.

[PRODUCT RECORDING](/assets/content/works/talkie/conversation.mp4)

[Image description](/assets/content/works/talkie/conversation-poster.jpg)

### Conversation screen

Character imagery, long messages, and the input area.

Xingye character conversation with long messages and an input area

#### List rendering

Long text and images increase rendering costs. Scrolling FPS, memory use, and OOM incidents need to be considered together.

[PRODUCT SCREENSHOT](/assets/content/works/talkie/immersive.jpg)

### Creation entry points

Entry points for characters, video, images, and audio in the current product.

Xingye creation page with character, video, image, and audio entry points

#### Product context

This screenshot shows the current product's scope. These creation features are outside the personal responsibilities described here.

[PRODUCT SCREENSHOT](/assets/content/works/talkie/creation.jpg)

## Messaging responsibilities

Conversation UI, message handling, and connection and data infrastructure. Select a node for details.

Responsibility map for the Talkie and Xingye client messaging system

Based on my 2023.06–2025.03 scope. Excludes model-service internals and is not a complete production architecture.

### Conversation UI

#### One-to-one / Group chat

Supported conversations with AI characters, including send feedback and streaming replies.

#### Conversation list

Owned conversation-list work alongside synchronization, roaming, and local data handling.

### Message handling

#### Message list / DiffableDataSource

Rebuilt the message list and optimized rendering. Scrolling improved from 51 to 60 FPS, memory use fell by 22%, and OOM incidents fell by 23%.

#### Send state / ACK

Built send callbacks, acknowledgments, and state tracking in-house, reducing dependency on Easemob.

#### Upstream / Downstream streaming

Changed the client and server message path from write-through to write-back and added streaming over an in-house persistent connection. p90 latency fell by 610 ms.

### Connections and data

#### In-house persistent connection

Built persistent connections and recovery, combining push and pull strategies with short-request compensation. Connection-system SLA rose from 68% to a stable 99.9%.

#### Persistence / Sync / Consistency

Built persistence and synchronization covering offline messages, roaming, database write-back, and consistency checks.

#### Alamofire / Moya networking

Built cache policies, request pools, priorities, custom serialization, and recovery. DNS and weak-network changes improved first-byte time by 42%.

## Before and after

Select a metric. FPS and SLA use raw values. Memory and weak-network first-byte time use a baseline of 100 because only relative reductions are available.

Measurement period: 2023.06–2025.03, not current live performance. Connection-system SLA and conversation availability are different metrics.

Before = 100. Relative change only, not MB or milliseconds. Lower is better.

Raw values. Higher is better.

### List scrolling FPS

- **Before**: 51 FPS

- **After**: 60 FPS

Rebuilt the message list with DiffableDataSource and optimized rendering. Scrolling improved from 51 to 60 FPS.

### Connection-system SLA

- **Before**: 68 %

- **After**: 99.9 %

Built connection and synchronization capabilities with push, pull, and short-request compensation. SLA rose from 68% to a stable 99.9%.

### Memory use

- **Before**: 100 index

- **After**: 78 index

Rendering changes reduced memory use by 22%, taking the index from 100 to 78. OOM incidents fell by 23% during the same period.

### Weak-network first byte

- **Before**: 100 index

- **After**: 58 index

DNS and weak-network changes improved first-byte time by 42%, taking the index from 100 to 58.

## Message latency, list performance, and connection recovery

Client and server changes, results during the project period, and the constraints involved.

### Message critical path

- **Problem**: The wait between sending a message and seeing a reply includes transport, processing, and UI updates. A single request's latency does not measure the whole wait.

- **Implementation**: Led client and server changes from write-through to write-back and introduced upstream and downstream streaming over an in-house persistent connection. p90 conversation latency fell by 610 ms. During the corresponding period, retention increased by 1.4% and conversation count by 10%.

- **Tradeoffs**: A shorter critical path still needs persistence and consistency. Send feedback, message state, and final processing results need to be traceable together.

### Message-list rendering

- **Problem**: Long text, continuous replies, and character images increase rendering costs. Scrolling FPS and memory need to be measured together.

- **Implementation**: Rebuilt the message list with DiffableDataSource. Scrolling improved from 51 to 60 FPS, memory use fell by 22%, and OOM incidents fell by 23%.

- **Tradeoffs**: Partial updates reduce repeated rendering, but the data source and message state must stay consistent. Frame-rate improvements should not come at the cost of memory or crashes.

### Connection recovery and synchronization

- **Problem**: Network changes interrupt message transport. Recovery needs to account for missed messages, send status, and local data consistency.

- **Implementation**: Built persistence, synchronization, and send callbacks in-house, combining push and pull strategies with short-request compensation. Conversation availability reached 99.9%; connection-system SLA rose from 68% to a stable 99.9%. DNS and weak-network changes improved first-byte time by 42%.

- **Tradeoffs**: Recovering a connection and synchronizing messages are separate problems. Conversation availability and connection-system SLA also have different definitions and must not be used interchangeably.

## Message delivery and connection recovery

Illustrative demo

Choose a connection state and run the send, reply, and synchronization flow. Disconnected mode requires manual recovery.

A local illustration with no model or production-service connection. Step order and animation duration do not represent production protocols or performance.

### Scenarios

- Stable connection

- Simulate disconnect

### 1. Local feedback

- **Default scenario**: Show the sending state.

- **Comparison scenario**: Show the sending state.

### 2. Message transport

- **Default scenario**: Transmit over the persistent connection and track sending and acknowledgment.

- **Comparison scenario**: Simulate a disconnection. Resume transport and acknowledgment after reconnecting.

### 3. Streaming reply

- **Default scenario**: Display incoming reply content and update the list.

- **Comparison scenario**: Continue displaying the reply after recovery. The real product also needs synchronization and compensation mechanisms.

### 4. Persistence and sync

- **Default scenario**: Persist messages, synchronize, and check state.

- **Comparison scenario**: Synchronize recovered messages and check local state.

### States and outputs

- **start**: Send message

- **running**: Processing…

- **resume**: Reconnect and continue

- **idle**: Choose a connection state, then send a message.

- **complete**: Reply displayed. State synchronized.

- **stalled**: Disconnected. Reconnect to continue.

- **sample**: MESSAGING / DEMO

- **output**: Waiting to send

- **outputRunning**: Sent, awaiting reply

- **outputComplete**: Synchronized

## Project notes

## My role

Owned the core IM modules, networking infrastructure, and stability work for the Xingye / Talkie AI chatbot apps. Supported one-to-one and group conversations with AI characters, along with conversation-list management.

The messaging layer covered push delivery, offline messages, persistence, acknowledgments, message synchronization and roaming, local database write-back, and consistency checks.

## Message latency and list performance

Led end-to-end messaging improvements across the client and server. Changed the message path from write-through to write-back and introduced streaming for upstream and downstream messages over an in-house persistent connection.

The work reduced p90 conversation latency by **610 ms**. Related project-stage results were a **1.4%** increase in retention and a **10%** increase in conversation count.

Rebuilt the message list with DiffableDataSource, increasing scrolling performance from **51 to 60 FPS**. Rendering optimizations reduced memory use by **22%** and OOM incidents by **23%**.

## Synchronization and networking

Reduced dependency on Easemob by building persistence, synchronization, and before/after-send callbacks in-house. Combined push and pull strategies with persistent connections to improve message consistency. Conversation availability reached **99.9%**, while connection-system SLA rose from an initial 68% and stabilized at **99.9%**.

Built networking infrastructure with Alamofire and Moya, supporting cache policies, request pools and priorities, custom serialization, connection recovery, and short-request compensation. DNS and weak-network improvements reduced weak-network first-byte time by **42%**.

## UI automation and retention work

Explored LLM-assisted UI automation using Poco, WDA, and Claude Sonnet to navigate the app and execute cases. Contributed to new-user retention work through first-feed caching, follow conversion, and deeplink improvements.

These results use the measurement scope of the corresponding project period.
