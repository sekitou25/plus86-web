---
title: "Message delivery and connection recovery"
lead: "Choose a connection state and run the send, reply, and synchronization flow. Disconnected mode requires manual recovery."
modes: ["Stable connection","Simulate disconnect"]
start: "Send message"
running: "Processing…"
resume: "Reconnect and continue"
idle: "Choose a connection state, then send a message."
complete: "Reply displayed. State synchronized."
stalled: "Disconnected. Reconnect to continue."
sample: "MESSAGING / DEMO"
output: "Waiting to send"
outputRunning: "Sent, awaiting reply"
outputComplete: "Synchronized"
footnote: "A local illustration with no model or production-service connection. Step order and animation duration do not represent production protocols or performance."
---

## Local feedback

### Default scenario

Show the sending state.

### Comparison scenario

Show the sending state.

## Message transport

### Default scenario

Transmit over the persistent connection and track sending and acknowledgment.

### Comparison scenario

Simulate a disconnection. Resume transport and acknowledgment after reconnecting.

## Streaming reply

### Default scenario

Display incoming reply content and update the list.

### Comparison scenario

Continue displaying the reply after recovery. The real product also needs synchronization and compensation mechanisms.

## Persistence and sync

### Default scenario

Persist messages, synchronize, and check state.

### Comparison scenario

Synchronize recovered messages and check local state.
