---
slug: "plumber"
title: "plumber"
company: "Personal project"
period: "In progress"
role: "Strategy research & system development"
category: "AI & trading"
headline: "Research and implementation of an automated trading agent"
summary: "A personal project in development: strategy research, backtesting, IBKR execution, separate ledgers, and local monitoring."
tags: ["Python", "IBKR", "Strategy research", "Execution & monitoring"]
focus: ["Research & backtesting", "Execution & reconciliation", "Local monitoring"]
highlights: [{"value": "IBKR", "label": "Execution adapter"}, {"value": "Separate ledgers", "label": "Strategy and environment isolation"}, {"value": "Local monitoring", "label": "Status, fills, and logs"}]
visual: {"caption": "Trading-system workflow illustration", "label": "RESEARCH / EXECUTION", "title": "plumber", "subtitle": "Automated trading agent", "nodes": ["Research / Signal", "Risk checks", "Execute / Reconcile"], "footer": "Personal project / In development"}
---

## Scope

plumber is an automated trading AI agent in development. It includes research, backtesting, execution, separate ledgers, reconciliation, and local monitoring.

Research covers risk parity, statistical arbitrage, bond seasonality, and order flow. Each strategy needs a record of its return hypothesis, costs, execution constraints, and parameter choices.

## Research and execution

Research notebooks are separated from the execution layer. Shared infrastructure covers IBKR integration, connection heartbeats, safe execution, separate ledgers, and audit records. Configuration and runtime state are isolated by strategy and trading environment.

The system records signal calculations, orders, fills, and reconciliation for investigating execution differences.

## Monitoring

Building a local monitoring interface for strategy status, positions, equity, fills, and redacted logs. Monitoring is separated from trading services, with explicit environment selection and stop mechanisms.

## Open questions

Continue checking the effects of costs, fill deviations, and execution failures. The system remains in development; an implementation does not establish strategy validity or imply a return guarantee.
