---
slug: "plumber"
title: "plumber"
company: "Research & engineering practice"
period: "In progress"
role: "Strategy research & system development"
category: "AI & trading"
headline: "Connecting trading ideas into a traceable system."
summary: "An automated trading AI agent project in progress. Connecting quantitative research with signals, risk constraints, order execution, reconciliation, and monitoring."
tags: ["Python", "IBKR", "Strategy research", "Execution & monitoring"]
focus: ["Research & backtesting", "Execution & reconciliation", "Local monitoring"]
highlights: [{"value": "Research → run", "label": "Connecting strategies to execution"}, {"value": "Separate ledgers", "label": "Isolation by strategy and environment"}, {"value": "Traceable", "label": "Logs, reconciliation & monitoring"}]
visual: {"caption": "Trading-system workflow illustration", "label": "RESEARCH → EXECUTION", "title": "plumber", "subtitle": "Automated trading AI agent", "nodes": ["Research / Signal", "Risk checks", "Execute / Reconcile"], "footer": "Keep researching. Keep validating."}
---

## What I'm building

plumber is an automated trading AI agent project in progress. It starts with strategy research and reproducible backtests, then connects execution, separate ledgers, reconciliation, and a local monitoring interface.

Research directions include risk parity, statistical arbitrage, bond seasonality, and order flow. The focus is on whether strategy hypotheses, costs, execution constraints, and parameter decisions can be explained, reproduced, and tested.

## Connecting research to execution

Research notebooks are separated from the execution layer. Shared infrastructure covers IBKR integration, connection heartbeats, safe execution, separate ledgers, and audit records. Configuration and runtime state are isolated by strategy and trading environment.

Recording signal generation, orders, fills, and reconciliation makes an execution traceable, beyond its final outcome.

## Making the running system visible

Building a local monitoring interface for strategy status, positions, equity, fills, and redacted logs. Monitoring is separated from trading services, with explicit environment selection and stop mechanisms.

## Current focus

Continue testing strategy behavior under costs, fill deviations, and execution failures, and improve the connections between research, execution, and monitoring. Keep a record of hypotheses, constraints, and engineering tradeoffs.
