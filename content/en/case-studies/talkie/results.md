---
kicker: "PROJECT METRICS"
title: "Before and after"
lead: "Select a metric. FPS and SLA use raw values. Memory and weak-network first-byte time use a baseline of 100 because only relative reductions are available."
beforeLabel: "Before"
afterLabel: "After"
fpsLabel: "FPS"
percentLabel: "%"
indexLabel: "index"
indexNote: "Before = 100. Relative change only, not MB or milliseconds. Lower is better."
rawNote: "Raw values. Higher is better."
note: "Measurement period: 2023.06–2025.03, not current live performance. Connection-system SLA and conversation availability are different metrics."
data: "../../../case-studies/talkie/metrics.json"
---

## scrolling | List scrolling FPS

Rebuilt the message list with DiffableDataSource and optimized rendering. Scrolling improved from 51 to 60 FPS.

## availability | Connection-system SLA

Built connection and synchronization capabilities with push, pull, and short-request compensation. SLA rose from 68% to a stable 99.9%.

## memory | Memory use

Rendering changes reduced memory use by 22%, taking the index from 100 to 78. OOM incidents fell by 23% during the same period.

## weak-network | Weak-network first byte

DNS and weak-network changes improved first-byte time by 42%, taking the index from 100 to 58.
