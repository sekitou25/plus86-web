---
title: "Message latency, list performance, and connection recovery"
lead: "Client and server changes, results during the project period, and the constraints involved."
---

## Message critical path

### Experience goal

The wait between sending a message and seeing a reply includes transport, processing, and UI updates. A single request's latency does not measure the whole wait.

### Engineering work

Led client and server changes from write-through to write-back and introduced upstream and downstream streaming over an in-house persistent connection. p90 conversation latency fell by 610 ms. During the corresponding period, retention increased by 1.4% and conversation count by 10%.

### Trade-off

A shorter critical path still needs persistence and consistency. Send feedback, message state, and final processing results need to be traceable together.

## Message-list rendering

### Experience goal

Long text, continuous replies, and character images increase rendering costs. Scrolling FPS and memory need to be measured together.

### Engineering work

Rebuilt the message list with DiffableDataSource. Scrolling improved from 51 to 60 FPS, memory use fell by 22%, and OOM incidents fell by 23%.

### Trade-off

Partial updates reduce repeated rendering, but the data source and message state must stay consistent. Frame-rate improvements should not come at the cost of memory or crashes.

## Connection recovery and synchronization

### Experience goal

Network changes interrupt message transport. Recovery needs to account for missed messages, send status, and local data consistency.

### Engineering work

Built persistence, synchronization, and send callbacks in-house, combining push and pull strategies with short-request compensation. Conversation availability reached 99.9%; connection-system SLA rose from 68% to a stable 99.9%. DNS and weak-network changes improved first-byte time by 42%.

### Trade-off

Recovering a connection and synchronizing messages are separate problems. Conversation availability and connection-system SLA also have different definitions and must not be used interchangeably.
