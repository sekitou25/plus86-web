---
kicker: "MESSAGING / RESPONSIBILITIES"
title: "Messaging responsibilities"
lead: "Conversation UI, message handling, and connection and data infrastructure. Select a node for details."
selectionLabel: "Responsibilities and implementation"
defaultNode: "connection"
diagramLabel: "Responsibility map for the Talkie and Xingye client messaging system"
note: "Based on my 2023.06–2025.03 scope. Excludes model-service internals and is not a complete production architecture."
---

## experience | Conversation UI

### conversations | One-to-one / Group chat

Supported conversations with AI characters, including send feedback and streaming replies.

### sessions | Conversation list

Owned conversation-list work alongside synchronization, roaming, and local data handling.

## messaging | Message handling

### rendering | Message list / DiffableDataSource

Rebuilt the message list and optimized rendering. Scrolling improved from 51 to 60 FPS, memory use fell by 22%, and OOM incidents fell by 23%.

### acknowledgments | Send state / ACK

Built send callbacks, acknowledgments, and state tracking in-house, reducing dependency on Easemob.

### streaming | Upstream / Downstream streaming

Changed the client and server message path from write-through to write-back and added streaming over an in-house persistent connection. p90 latency fell by 610 ms.

## infrastructure | Connections and data

### connection | In-house persistent connection

Built persistent connections and recovery, combining push and pull strategies with short-request compensation. Connection-system SLA rose from 68% to a stable 99.9%.

### persistence | Persistence / Sync / Consistency

Built persistence and synchronization covering offline messages, roaming, database write-back, and consistency checks.

### network | Alamofire / Moya networking

Built cache policies, request pools, priorities, custom serialization, and recovery. DNS and weak-network changes improved first-byte time by 42%.
