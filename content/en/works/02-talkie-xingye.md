---
slug: "talkie-xingye"
title: "Talkie / Xingye"
company: "MiniMax"
period: "2023.06 — 2025.03"
role: "Senior iOS Engineer"
category: "AI & conversation"
headline: "IM, streaming messages, and networking infrastructure"
summary: "Owned core IM modules, message latency, list rendering, persistent connections, and networking infrastructure for Talkie and Xingye."
tags: ["Swift", "IM", "Persistent connections", "DiffableDataSource"]
focus: ["End-to-end messaging", "Streaming conversations", "Networking & stability"]
highlights: [{"value": "−610 ms", "label": "p90 conversation latency"}, {"value": "51 → 60", "label": "Message-list scrolling FPS"}, {"value": "99.9%", "label": "Conversation availability"}]
visual: {"caption": "Messaging and networking modules", "label": "MESSAGING / NETWORKING", "title": "Talkie / Xingye", "subtitle": "Messaging and networking", "nodes": ["Client", "Connection", "AI conversation"], "footer": "Streaming · Synchronization · Persistence"}
---

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
